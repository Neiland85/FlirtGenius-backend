require('dotenv').config();  // Cargar variables de entorno desde el archivo .env
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Falta la variable de entorno MONGODB_URI");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db('nombreBaseDeDatos');  // Reemplaza con el nombre de tu base de datos
    const collection = database.collection('nombreColeccion');  // Reemplaza con el nombre de tu colección

    // Insertar un documento
    const insertResult = await collection.insertOne({ nombre: "Ejemplo", valor: 42 });
    console.log('Documento insertado con _id:', insertResult.insertedId);

    // Buscar documentos
    const findResult = await collection.find({ nombre: "Ejemplo" }).toArray();
    console.log('Documentos encontrados:', findResult);

    // Actualizar un documento
    const updateResult = await collection.updateOne({ nombre: "Ejemplo" }, { $set: { valor: 100 } });
    console.log('Documentos actualizados:', updateResult.modifiedCount);

    // Eliminar un documento
    const deleteResult = await collection.deleteOne({ nombre: "Ejemplo" });
    console.log('Documentos eliminados:', deleteResult.deletedCount);

  } catch (err) {
    console.error("Error al conectar a MongoDB o realizar operaciones:", err);
  } finally {
    await client.close();  // Cerrar la conexión al final
    console.log("Conexión cerrada");
  }
}

run().catch(console.dir);

