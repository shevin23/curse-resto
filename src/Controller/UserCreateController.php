<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCreateController extends AbstractController
{
    public function __invoke(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
    ): Response {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setUserType($data['userType']);


        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        $email = (new Email())
            ->from('shevinlingiah@gmail.com')
            ->to($user->getEmail())
            ->subject('Welcome to the Undead Feast—You’re One of Us Now!')
            ->text("Greetings, lost soul...\n\nThe gates of the Zombie & Mummy Resto have creaked open for you, and there’s no turning back! Your registration is confirmed—your fate is sealed.\n\nPrepare for a feast like no other, where the undead roam and ancient mummies whisper secrets of the underworld.\n\nKeep an eye out… We may be watching.\n\nSee you soon in the land of the living… or not.\n\n🕯️ The Undead Resto Team 🕯️")
        ;
        $mailer->send($email);

        return $this->json([
            'message' => 'User registered successfully',
            'userId' => $user->getId()
        ], Response::HTTP_CREATED);
    }
}
