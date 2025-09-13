-- CreateTable
CREATE TABLE "public"."metric_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "metric_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "conversion_to_base" TEXT NOT NULL,
    "conversion_from_base" TEXT NOT NULL,
    "metric_type_id" INTEGER NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metric_entries" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "metric_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metric_types_name_key" ON "public"."metric_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_symbol_key" ON "public"."units"("symbol");

-- AddForeignKey
ALTER TABLE "public"."units" ADD CONSTRAINT "units_metric_type_id_fkey" FOREIGN KEY ("metric_type_id") REFERENCES "public"."metric_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."metric_entries" ADD CONSTRAINT "metric_entries_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
