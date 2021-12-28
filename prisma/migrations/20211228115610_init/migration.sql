-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "icon" BIGINT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id","idUser")
);

-- CreateTable
CREATE TABLE "Password" (
    "id" UUID NOT NULL,
    "idCategory" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id","idUser","idCategory")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_idCategory_idUser_fkey" FOREIGN KEY ("idCategory", "idUser") REFERENCES "Category"("id", "idUser") ON DELETE CASCADE ON UPDATE CASCADE;
