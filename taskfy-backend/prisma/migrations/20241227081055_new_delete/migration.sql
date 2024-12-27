/*
  Warnings:

  - You are about to alter the column `loggedHours` on the `hour` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `allocatedHours` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `consumedHours` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- DropIndex
DROP INDEX `Availability_employeeId_fkey` ON `availability`;

-- DropIndex
DROP INDEX `Hour_employeeId_fkey` ON `hour`;

-- DropIndex
DROP INDEX `Hour_projectId_fkey` ON `hour`;

-- DropIndex
DROP INDEX `Project_adminId_fkey` ON `project`;

-- DropIndex
DROP INDEX `User_managerId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `hour` MODIFY `loggedHours` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `allocatedHours` DOUBLE NOT NULL,
    MODIFY `consumedHours` DOUBLE NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hour` ADD CONSTRAINT `Hour_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hour` ADD CONSTRAINT `Hour_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
