-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'por_asignar',
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualiza" DATETIME NOT NULL,
    "idProyecto" INTEGER NOT NULL,
    "idUsuarioAsigna" INTEGER,
    "idUsuarioAsignado" INTEGER,
    CONSTRAINT "Tarea_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tarea_idUsuarioAsigna_fkey" FOREIGN KEY ("idUsuarioAsigna") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tarea_idUsuarioAsignado_fkey" FOREIGN KEY ("idUsuarioAsignado") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tarea" ("descripcion", "estado", "fechaActualiza", "fechaCreacion", "id", "idProyecto", "idUsuarioAsigna", "idUsuarioAsignado") SELECT "descripcion", "estado", "fechaActualiza", "fechaCreacion", "id", "idProyecto", "idUsuarioAsigna", "idUsuarioAsignado" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
