CREATE TABLE IF NOT EXISTS "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" char(5) NOT NULL,
	"password" char(70),
	"size" bigint NOT NULL,
	"expires" bigint NOT NULL,
	CONSTRAINT "files_externalId_unique" UNIQUE("externalId")
);
