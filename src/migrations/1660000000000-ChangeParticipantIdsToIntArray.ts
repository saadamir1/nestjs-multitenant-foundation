import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeParticipantIdsToIntArray1660000000000
  implements MigrationInterface
{
  name = 'ChangeParticipantIdsToIntArray1660000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add a new column with the correct type
    await queryRunner.query(
      `ALTER TABLE "chat_rooms" ADD "participantIds_temp" integer[]`,
    );
    // 2. Convert and copy data from old column to new column
    await queryRunner.query(
      `UPDATE "chat_rooms" SET "participantIds_temp" = string_to_array("participantIds", ',')::int[]`,
    );
    // 3. Drop the old column
    await queryRunner.query(
      `ALTER TABLE "chat_rooms" DROP COLUMN "participantIds"`,
    );
    // 4. Rename the new column to the original name
    await queryRunner.query(
      `ALTER TABLE "chat_rooms" RENAME COLUMN "participantIds_temp" TO "participantIds"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Add the old column back as simple-array (text)
    await queryRunner.query(
      `ALTER TABLE "chat_rooms" ADD "participantIds_temp" text`,
    );
    // 2. Convert and copy data from array to string
    await queryRunner.query(
      `UPDATE "chat_rooms" SET "participantIds_temp" = array_to_string("participantIds", ',')`,
    );
    // 3. Drop the integer[] column
    await queryRunner.query(
      `ALTER TABLE "chat_rooms" DROP COLUMN "participantIds"`,
    );
    // 4. Rename the temp column back
    await queryRunner.query(
      `ALTER TABLE "chat_rooms" RENAME COLUMN "participantIds_temp" TO "participantIds"`,
    );
  }
}
