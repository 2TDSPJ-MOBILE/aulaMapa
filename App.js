import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select'


//Importando a biblioteca de localização
import * as Location from 'expo-location'

//Importando a biblioteca do Mapa
import MapView, { Marker } from 'react-native-maps';

const nomeAlunos = [
  { label: "Fernando", value: [37.42, -122.08] },
  { label: "Henrique", value: "Henrique" },
  { label: "Isabella", value: "Isabella" }
]

export default function App() {
  const [alunoSelecionado, setAlunoSelecionado] = useState('')

  //Criando estado para armazenar as coordenadas geográficas(latitude e logintude)
  const [location, setLocation] = useState('')

  //Criando estado para armazenar o endereço de acordo com a latitude e longitude
  const [address, setAddress] = useState(null)

  //Criando estado para armazenar o status da permissão de acesso à localização
  const [permission, setPermission] = useState(null)

  //UseEffect solicitar permissão da localização
  useEffect(() => {
    (async () => {
      //Solicitar permissão para acessar a localização
      const { status } = await Location.requestForegroundPermissionsAsync()
      setPermission(status)//Armazena o status da permissão

      //Verificar se a permissão for concedida
      if (status === 'granted') {
        //Obter localização atual do disposito
        const userLocation = await Location.getCurrentPositionAsync({})
        setLocation(userLocation.coords)

        //Converter latitude/longitude em um endereço(geocodificação reversa)
        const addressResult = await Location.reverseGeocodeAsync(userLocation.coords)
        setAddress(addressResult[0]) //Armazena o endereço mais relavante
      }
    })(); //Função assíncrona autoexecutável
  }, [])

  //Se a permissão foi negada
  if (permission !== 'granted') {
    return (
      <View>
        <Text>Permissão da localização não foi concedida</Text>
        <Button title='Solicitar Permissão' onPress={() => {
          (async () => {
            //Solicitar permissão para acessar a localização
            const { status } = await Location.requestForegroundPermissionsAsync()
            setPermission(status)//Armazena o status da permissão
          })()
        }} />
      </View>
    )
  }

  //Função para exibir o endereço
  const renderAddress = () => {
    if (!address) return <Text>Carregando endereço...</Text>

    const street = address?.street || 'Rua não encontrada'
    const city = address?.city || 'Cidade não encontrada'
    const region = address?.region || 'Estado não encontrado'
    const country = address?.country || 'País não encontrado'
    const postalCode = address?.postalCode || 'CEP não encontrado'

    return (
      <View>
        <Text>Endereço completo:</Text>
        <Text>Rua:{street}</Text>
        <Text>Cidade:{city}</Text>
        <Text>Estado:{region}</Text>
        <Text>País:{country}</Text>
        <Text>CEP:{postalCode}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text>Sua localização</Text>
      {location ? (
        <>
          <Text>Latitude:{location.latitude}</Text>
          <Text>Logintude:{location.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
             latitudeDelta: 0.01,//Zoom vertical
              longitudeDelta: 0.01//Zoom horizontal
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              title='Você está aqui.'
            />
          </MapView>
          {renderAddress()}
          <RNPickerSelect
            items={nomeAlunos}
            onValueChange={(value) => setAlunoSelecionado(value)}
            placeholder={{ label: 'Escolha uma aluno...', value: null }}
          />

          {alunoSelecionado ? (
            <Text>Aluno selecionado:{alunoSelecionado}</Text>
          ) : null}
          {console.log(alunoSelecionado)}
        </>
      ) : (
        <Text>Carregando localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: 400
  }
});
