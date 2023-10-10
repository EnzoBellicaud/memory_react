import React, {useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Pressable } from 'react-native-web';

const App = () => {
  const [pairs, setPairs] = useState('5');
  const [scores, setScore] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [fin, setFin] = useState(true);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

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
          setScore((prevScore) => {
            const newScore = [...prevScore];
            newScore[currentPlayer] += 10;
            return newScore;
          });
          setFlippedCards([]);
        } else {
          setTimeout(() => {
            card1.flipped = false;
            card.flipped = false;
            setFlippedCards([]);
          }, 1000);
        }
        if (cards.every((card) => card.flipped)) {
          setFin(true);
        }
        setCurrentPlayer((currentPlayer + 1) % players.length);
      }
    }
  };

  



  const startGame = () => {
    createCards(parseInt(pairs));
    if (players.length === 0) {
      setPlayers(['Player 1']);
      setScore([0]);
    } else {
      players.map((player, index) => {
        if (player === '') {
          players[index] = 'Player ' + (index + 1);
          scores[index] = 0;
        }
      });
    };
    setFin(false);
  };

  const endGame = () => {
    setFin(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Memory Game</Text>
      <View style={styles.form}>

        <Text style={styles.label}>Number of pairs:</Text>
        <TextInput
          style={styles.input}
          value={pairs}
          onChangeText={setPairs}
          inputMode="numeric"
        />

        <Text style={styles.label}>Players:</Text>
        {players.map((player, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={player}
            onChangeText={(text) => {
              const newPlayers = [...players];
              newPlayers[index] = text;
              setPlayers(newPlayers);
            }}
          />
        ))}

        <Pressable style={({ pressed }) => pressed ? [styles.pressable, styles.pressed] : styles.pressable}
          onPress={() => {
            setPlayers([...players, '']);
            endGame()
          }}>
          <Text style={styles.buttonText}>Add Player</Text>
        </Pressable>

        <Pressable style={({ pressed }) => pressed ? [styles.pressable, styles.pressed] : styles.pressable}
          onPress={() => {
            setPlayers([...players.slice(0, -1)]);
            endGame()
          }}
          disabled={players.length === 0}>
          <Text style={styles.buttonText}>Delete Player</Text>
        </Pressable>
      </View>

      <Pressable style={({ pressed }) => pressed ? [styles.pressable, styles.pressed] : styles.pressable}
        onPress={startGame}>
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>

      {fin ?
        (<Text style={styles.gameOver}>Fini !</Text>) : (
          <>
            <Text style={styles.score}>Current Player: {players[currentPlayer]}</Text>
            <ScrollView style={styles.memoryGrid} contentContainerStyle={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              {cards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={[styles.card, { backgroundColor: card.flipped ? card.param : '#ccc' }]}
                  onPress={() => flipCard(card)}
                >
                  <Text style={{ color: card.flipped ? '#000' : '#ccc' }}>
                    {card.flipped ? card.value : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

      <Text style={styles.score}>Score:</Text>
      {
        scores.map((playerScore, index) => (
          <Text key={index} style={styles.score}>
            {players[index]}: {playerScore}
          </Text>
        ))

      }
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
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    backgroundColor: '#3498fa', // Couleur par défaut
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
  },

  pressed: {
    backgroundColor: '#2980b9', // Couleur lorsqu'appuyé
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default App;
