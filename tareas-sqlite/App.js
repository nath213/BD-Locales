import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;

const initDB = async () => {
  db = await SQLite.openDatabaseAsync('tareas.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL
    );
  `);
};

const getDb = () => db;

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const iniciar = async () => {
      await initDB(); 
      await cargarTareas(); 
    };
    iniciar();
  }, []);

  const cargarTareas = async () => {
    const db = getDb();
    const resultado = await db.getAllAsync('SELECT * FROM tareas;');
    setTareas(resultado);
  };

  const agregarTarea = async () => {
    if (!titulo.trim()) return;

    const db = getDb();
    await db.runAsync('INSERT INTO tareas (titulo) VALUES (?);', [titulo.trim()]);
    setTitulo('');
    cargarTareas();
  };

  const eliminarTarea = async (id) => {
    const db = getDb();
    await db.runAsync('DELETE FROM tareas WHERE id = ?;', [id]);
    cargarTareas();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Lista de Tareas</Text>

      <TextInput
        placeholder="Escribe una nueva tarea"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />

      <Button title="Agregar Tarea" onPress={agregarTarea} />

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.tituloTarea}>{item.titulo}</Text>
            <Button title="Eliminar" color="red" onPress={() => eliminarTarea(item.id)} />
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tituloTarea: {
    flex: 1,
    fontSize: 16,
  },
});
