-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id_cliente" VARCHAR(32) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "public"."Dispositivo" (
    "id_dispositivo" VARCHAR(32) NOT NULL,
    "nome" TEXT NOT NULL,
    "macAddress" TEXT NOT NULL,

    CONSTRAINT "Dispositivo_pkey" PRIMARY KEY ("id_dispositivo")
);

-- CreateTable
CREATE TABLE "public"."Locacao" (
    "id_locacao" VARCHAR(32) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),
    "custoTotal" DOUBLE PRECISION,
    "clienteId" TEXT NOT NULL,
    "dispositivoId" TEXT NOT NULL,

    CONSTRAINT "Locacao_pkey" PRIMARY KEY ("id_locacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dispositivo_macAddress_key" ON "public"."Dispositivo"("macAddress");

-- AddForeignKey
ALTER TABLE "public"."Locacao" ADD CONSTRAINT "Locacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Locacao" ADD CONSTRAINT "Locacao_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "public"."Dispositivo"("id_dispositivo") ON DELETE RESTRICT ON UPDATE CASCADE;
