import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';

const App = () => {
  const [pairs, setPairs] = useState('4');
  const [timer, setTimer] = useState('60');
  const [unlimited, setUnlimited] = useState(false);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const createCards = (pairs) => {
    const cardValues = [];
    const cardColors = [];
    
    for (let i = 1; i <= pairs; i++) {
      cardValues.push(i.toString(), i.toString());
      cardColors.push(`hsl(${Math.random() * 360}, 100%, 50%)`);
    }
    
    const shuffledValues = shuffle(cardValues);
    const newCards = shuffledValues.map((value, index) => ({
      id: index,
      value: value,
      param: cardColors[parseInt(value) - 1],
      flipped: false,
    }));
    
    setCards(newCards);
    setFlippedCards([]);
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const flipCard = (card) => {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.flipped) {
      card.flipped = true;
      setFlippedCards([...flippedCards, card]);

      if (flippedCards.length === 1) {
        const [card1] = flippedCards;
        if (card1.value === card.value) {
          setScore(score + 10);
          setFlippedCards([]);
        } else {
          setTimeout(() => {
            card1.flipped = false;
            card.flipped = false;
            setFlippedCards([]);
          }, 1000);
        }
      }
    }
  };

  const startGame = () => {
    createCards(parseInt(pairs));
    setScore(0);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Memory Game</Text>
      {gameOver ? (
        <Text style={styles.gameOver}>Game Over! Your score is {score}.</Text>
      ) : (
        <>
          <View style={styles.form}>
            <Text style={styles.label}>Number of pairs:</Text>
            <TextInput
              style={styles.input}
              value={pairs}
              onChangeText={setPairs}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Timer duration (in seconds):</Text>
            <TextInput
              style={styles.input}
              value={timer}
              onChangeText={setTimer}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Unlimited time:</Text>
            <TouchableOpacity onPress={() => setUnlimited(!unlimited)}>
              <View style={styles.checkbox}>
                {unlimited && <View style={styles.checkedBox} />}
              </View>
            </TouchableOpacity>
          </View>
          <Button title="Start Game" onPress={startGame} />
          <ScrollView style={styles.memoryGrid} contentContainerStyle={{flex: 1, flexDirection: "row", flexWrap: "wrap"}}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                  { backgroundColor: card.flipped ? card.param : '#ccc' },
                ]}
                onPress={() => flipCard(card)}
              >
                <Text style={{ color: card.flipped ? '#000' : '#ccc' }}>
                  {card.flipped ? card.value : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.score}>Score: {score}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    width: 50,
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: '#1abc9c',
  },
  memoryGrid: {
    margin: 20,
    },
  card: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1abc9c',
    margin: 20,
    textAlign: 'center',
  },
  gameOver: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1abc9c',
    margin: 20,
    textAlign: 'center',
  },
});

export default App;
