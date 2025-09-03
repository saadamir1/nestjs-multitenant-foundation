import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMultiTenancy1756846765881 implements MigrationInterface {
    name = 'AddMultiTenancy1756846765881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create workspaces table
        await queryRunner.query(`CREATE TABLE "workspaces" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "logo" character varying, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_de659ece27e93d8fe29339d0a42" UNIQUE ("name"), CONSTRAINT "UQ_b8e9fe62e93d60089dfc4f175f3" UNIQUE ("slug"), CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`);
        
        // Create default workspace for existing data
        await queryRunner.query(`INSERT INTO "workspaces" ("name", "slug", "description") VALUES ('Default Workspace', 'default', 'Default workspace for existing users')`);
        
        // Add workspaceId columns as nullable first
        await queryRunner.query(`ALTER TABLE "users" ADD "workspaceId" integer`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "workspaceId" integer`);
        await queryRunner.query(`ALTER TABLE "chat_rooms" ADD "workspaceId" integer`);
        
        // Update existing records to use default workspace (id = 1)
        await queryRunner.query(`UPDATE "users" SET "workspaceId" = 1 WHERE "workspaceId" IS NULL`);
        await queryRunner.query(`UPDATE "cities" SET "workspaceId" = 1 WHERE "workspaceId" IS NULL`);
        await queryRunner.query(`UPDATE "chat_rooms" SET "workspaceId" = 1 WHERE "workspaceId" IS NULL`);
        
        // Now make columns NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "workspaceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "workspaceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_rooms" ALTER COLUMN "workspaceId" SET NOT NULL`);
        
        // Add foreign key constraints
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_949fea12b7977a8b2f483bf802a" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_9c74ead1d55ca27b86fe42751f9" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_rooms" ADD CONSTRAINT "FK_2a76fe7739b6c79d37bd78d48c6" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_rooms" DROP CONSTRAINT "FK_2a76fe7739b6c79d37bd78d48c6"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_9c74ead1d55ca27b86fe42751f9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_949fea12b7977a8b2f483bf802a"`);
        await queryRunner.query(`ALTER TABLE "chat_rooms" DROP COLUMN "workspaceId"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "workspaceId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "workspaceId"`);
        await queryRunner.query(`DROP TABLE "workspaces"`);
    }

}
