<?php

namespace App\Command;

use App\DataFixtures\AppFixtures;
use App\Entity\Room;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:ensure-seed', description: 'Seed initial data if the database is empty (idempotent).')]
class EnsureSeedCommand extends Command
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // If there is at least one room, do nothing
        $count = (int) $this->em->getRepository(Room::class)
            ->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->getQuery()
            ->getSingleScalarResult();

        if ($count > 0) {
            $output->writeln('<info>Database already seeded. Skipping.</info>');
            return Command::SUCCESS;
        }

        // Seed minimal data using the same fixtures class (without purging)
        $output->writeln('<comment>Seeding initial data…</comment>');
        $fixtures = new AppFixtures();
        $fixtures->load($this->em);
        $this->em->flush();
        $output->writeln('<info>Seeding completed.</info>');
        return Command::SUCCESS;
    }
}
