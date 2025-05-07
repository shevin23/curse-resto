<?php

namespace App\Enum;

enum OrderStatus: string
{
    case PREPARING = 'preparing';
    case SUMMONING = 'summoning';
    case DELIVERING = 'delivering';
    case COMPLETED = 'completed';
}