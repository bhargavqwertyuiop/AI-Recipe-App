import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { usePantry } from '../contexts/PantryContext';
import { fetchRecipesByIngredients, fetchRecipeDetailById } from '../services/api';

export default function RecipesScreen({ route }) {
  const { items } = usePantry();
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);

  const ingredients = route?.params?.ingredients || items.map((i) => i.name).join(',');

  useEffect(() => {
    (async () => {
      const data = await fetchRecipesByIngredients(items.map((i) => i.name));
      setRecipes(data);
    })();
  }, [ingredients]);

  const openRecipe = async (id) => {
    const detail = await fetchRecipeDetailById(id);
    setSelected(detail);
  };

  if (selected) {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = selected[`strIngredient${i}`];
      const meas = selected[`strMeasure${i}`];
      if (ing && ing.trim()) list.push(`${ing} ${meas || ''}`.trim());
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>{selected.strMeal}</Text>
        <Text style={styles.section}>Ingredients</Text>
        {list.map((l, idx) => <Text key={idx} style={styles.item}>{l}</Text>)}
        <Text style={styles.section}>Instructions</Text>
        <Text style={styles.body}>{selected.strInstructions}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      {recipes?.length === 0 ? (
        <Text>No recipes found for: {ingredients || 'your pantry'}</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(r) => r.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => openRecipe(item.idMeal)}>
              <Text style={styles.cardTitle}>{item.strMeal}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  back: { color: '#007AFF', marginBottom: 12 },
  section: { marginTop: 12, fontWeight: '700' },
  item: { marginTop: 6 },
  body: { marginTop: 8, lineHeight: 20 },
});