<?php

namespace App\DataFixtures;

use App\Entity\Room;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\String\Slugger\AsciiSlugger;

class AppFixtures
{
    public function load(ObjectManager $manager): void
    {
        $slugger = new AsciiSlugger();
        $rooms = [
            [
                'name' => 'Suite Vue Mer', 'price' => 220, 'capacity' => 2,
                'description' => 'Vue panoramique, lit king-size, terrasse privée et lounge.',
                'photos' => [
                    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1200'
                ],
                'equipments' => ['WiFi','Parking','Climatisation','Machine Nespresso']
            ],
            [
                'name' => 'Chambre Standard', 'price' => 120, 'capacity' => 2,
                'description' => 'Confort moderne, literie premium et bureau.',
                'photos' => [
                    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'
                ],
                'equipments' => ['WiFi','TV']
            ],
            [
                'name' => 'Chambre Supérieure', 'price' => 160, 'capacity' => 2,
                'description' => 'Espace généreux, canapé et lumière naturelle.',
                'photos' => [
                    'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600&auto=format&fit=crop'
                ],
                'equipments' => ['WiFi','Climatisation','Mini-bar']
            ],
            [
                'name' => 'Suite Familiale', 'price' => 260, 'capacity' => 4,
                'description' => 'Deux chambres communicantes et salon.',
                'photos' => [
                    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200'
                ],
                'equipments' => ['WiFi','Parking','Lit bébé sur demande']
            ],
        ];
        foreach ($rooms as $r) {
            $room = (new Room())
                ->setName($r['name'])
                ->setPrice($r['price'])
                ->setCapacity($r['capacity'])
                ->setDescription($r['description'])
                ->setPhotos($r['photos'])
                ->setEquipments($r['equipments'])
                ->setSlug(strtolower((string)$slugger->slug($r['name'])));
            $manager->persist($room);
        }
        $manager->flush();
    }
}

