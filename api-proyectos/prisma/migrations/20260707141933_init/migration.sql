-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL,
    "idUsuarioCreador" INTEGER NOT NULL,
    "idUsuarioEjecutor" INTEGER NOT NULL,
    CONSTRAINT "Proyecto_idUsuarioCreador_fkey" FOREIGN KEY ("idUsuarioCreador") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Proyecto_idUsuarioEjecutor_fkey" FOREIGN KEY ("idUsuarioEjecutor") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL,
    "idProyecto" INTEGER NOT NULL,
    "idUsuarioAsigna" INTEGER NOT NULL,
    "idUsuarioAsignado" INTEGER NOT NULL,
    CONSTRAINT "Tarea_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tarea_idUsuarioAsigna_fkey" FOREIGN KEY ("idUsuarioAsigna") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarea_idUsuarioAsignado_fkey" FOREIGN KEY ("idUsuarioAsignado") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idTarea" INTEGER NOT NULL,
    "idUsuarioAccion" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNuevo" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Historico_idTarea_fkey" FOREIGN KEY ("idTarea") REFERENCES "Tarea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Historico_idUsuarioAccion_fkey" FOREIGN KEY ("idUsuarioAccion") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_nombre_idUsuarioCreador_key" ON "Proyecto"("nombre", "idUsuarioCreador");
