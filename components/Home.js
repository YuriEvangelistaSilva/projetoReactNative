
import { StyleSheet, Image, Text, View, ImageBackground } from 'react-native';
import R6 from '../assets/imagens_de_jogos/R6sige.jpg';
import bloodborne from '../assets/imagens_de_jogos/bloodborne.jpg';
import DBD from '../assets/imagens_de_jogos/DBD.jpg';
import farcry from '../assets/imagens_de_jogos/farcry.jpg';
import RE4 from '../assets/imagens_de_jogos/RE4.jpg';
import undertale from '../assets/imagens_de_jogos/undertale.jpg';
import Branble from '../assets/imagens_de_jogos/Branble.jpg';
import RARIPOTE from '../assets/imagens_de_jogos/RARIPOTE.jpg';
import starwars from '../assets/imagens_de_jogos/starwarsJedisurvivor.jpg';
import storitaler from '../assets/imagens_de_jogos/storitaler.jpg';
import fundo from '../assets/fundoGamer.jpg'

export default function Home() {
  return (
    <container style={styles.container}>
      <ImageBackground source={fundo}  resizeMode="cover" style={styles.imageBackground} >
      <text style={styles.category}>Porular Hoje</text>
      <games style={styles.games}>
        <View>
        <Image
          source={R6} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Rainbow six</text>
        <text style={styles.priceGames}>R$16.99</text>
        </View>
        <View>
        <Image
          source={undertale} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Undertale</text>
        <text style={styles.priceGames}>R$17.99</text>
        </View>
      </games>
      <games style={styles.games}>
        <View>
        <Image
          source={RE4} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>RE4</text>
        <text style={styles.priceGames}>R$26.99</text>
        </View>
        <View>
        <Image
          source={farcry} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Farcry</text>
        <text style={styles.priceGames}>R$96.99</text>
        </View>
      </games>
      <games style={styles.games}>
        <View>
        <Image
          source={DBD} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>DBD</text>
        <text style={styles.priceGames}>R$56.99</text>
        </View>
        <View>
        <Image
          source={bloodborne} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Bloodborne</text>
        <text style={styles.priceGames}>R$66.99</text>
        </View>
      </games>
      <games style={styles.games}>
        <View>
        <Image
          source={storitaler} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Storitaler</text>
        <text style={styles.priceGames}>R$166.99</text>
        </View>
        <View>
        <Image
          source={starwars} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Starwars</text>
        <text style={styles.priceGames}>R$88.99</text>
        </View>
      </games>
      <games style={styles.games}>
        <View>
        <Image
          source={RARIPOTE} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Raripote</text>
        <text style={styles.priceGames}>R$1.99</text>
        </View>
        <View>
        <Image
          source={Branble} style={styles.imageGames}>
        </Image>
        <text style={styles.nameGames}>Branble</text>
        <text style={styles.priceGames}>R$166.99</text>
        </View>
      </games>
      </ImageBackground>
    </container>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'auto',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  imageBackground:{
    flex: 1,
    justifyContent: 'center',
    width: '22.5em',
    height: '80em',
  },
  games:{
    display: 'flex',
  },
  imageGames: {
    borderRadius: '10px',
    margin: 10,
    width: '8.5em',
    height: '10em',
    
  },
  nameGames: {
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderTopRightRadius: '10px',
    borderTopLeftRadius:'10px',
    marginLeft: '0.5em',
    fontSize: '18px',
    fontFamily:'times new roman',
  },
  priceGames: {
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderEndEndRadius: '10px',
    borderEndStartRadius: '10px',
    marginLeft: '0.5em',
    fontSize: '18px',
    fontFamily:'times new roman',
  },
  category:{
    alignItems: 'center',
    fontSize:'2.5em',
    fontFamily:'times new roman',
    borderRadius: '5px',
    backgroundColor: '#fff',
    marginLeft: '0.1em',
    width: '7em',
  },

});
