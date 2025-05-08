<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250507180309 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE ingredient (id INT AUTO_INCREMENT NOT NULL, uuid BINARY(16) NOT NULL COMMENT '(DC2Type:uuid)', name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE menu_item (id INT AUTO_INCREMENT NOT NULL, room_id INT NOT NULL, uuid BINARY(16) NOT NULL COMMENT '(DC2Type:uuid)', name VARCHAR(255) NOT NULL, name_mummy VARCHAR(255) NOT NULL, name_zombie VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, price NUMERIC(10, 2) NOT NULL, curse_level INT NOT NULL, image_url VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_D754D55054177093 (room_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE menu_item_ingredient (menu_item_id INT NOT NULL, ingredient_id INT NOT NULL, INDEX IDX_EA047E5E9AB44FE0 (menu_item_id), INDEX IDX_EA047E5E933FE08C (ingredient_id), PRIMARY KEY(menu_item_id, ingredient_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, uuid BINARY(16) NOT NULL COMMENT '(DC2Type:uuid)', status VARCHAR(255) NOT NULL, identity VARCHAR(255) NOT NULL, customer_name VARCHAR(255) NOT NULL, customer_email VARCHAR(255) NOT NULL, special_requests LONGTEXT DEFAULT NULL, total_amount NUMERIC(10, 2) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE order_item (id INT AUTO_INCREMENT NOT NULL, order_id INT NOT NULL, menu_item_id INT NOT NULL, uuid BINARY(16) NOT NULL COMMENT '(DC2Type:uuid)', name VARCHAR(255) NOT NULL, price NUMERIC(10, 2) NOT NULL, quantity INT NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_52EA1F098D9F6D38 (order_id), INDEX IDX_52EA1F099AB44FE0 (menu_item_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE room (id INT AUTO_INCREMENT NOT NULL, uuid BINARY(16) NOT NULL COMMENT '(DC2Type:uuid)', name VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, image_url VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menu_item ADD CONSTRAINT FK_D754D55054177093 FOREIGN KEY (room_id) REFERENCES room (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menu_item_ingredient ADD CONSTRAINT FK_EA047E5E9AB44FE0 FOREIGN KEY (menu_item_id) REFERENCES menu_item (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menu_item_ingredient ADD CONSTRAINT FK_EA047E5E933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F098D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F099AB44FE0 FOREIGN KEY (menu_item_id) REFERENCES menu_item (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE menu_item DROP FOREIGN KEY FK_D754D55054177093
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menu_item_ingredient DROP FOREIGN KEY FK_EA047E5E9AB44FE0
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menu_item_ingredient DROP FOREIGN KEY FK_EA047E5E933FE08C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_item DROP FOREIGN KEY FK_52EA1F098D9F6D38
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_item DROP FOREIGN KEY FK_52EA1F099AB44FE0
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE ingredient
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE menu_item
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE menu_item_ingredient
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE `order`
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE order_item
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE room
        SQL);
    }
}
