import React, {useState,useEffect} from 'react';

import { View, 
         Text,
         Button,
         StyleSheet } from 'react-native';

import ButtonSection  from '../components/ButtonSection';
import ModalComponent from '../components/ModalComponent';

const HomeScreen = ({navigation}) => {

  // REACT STATE 
  const [ currentBal, setCurrentBal ]     = useState(0);

  // MODAL's STATE
  const [ modalCreditVisible, setModalCreditVisible ] = useState(false);
  const [ modalDebitVisible,  setModalDebitVisible  ] = useState(false);

  // QUERIES
  let readingPocketQuery : string  = 'SELECT * FROM Pocket WHERE id=1;'

  // DATABASE SECTION STARTS
  const readingPocket = () => {
    /*
     * READING Pocket
     * table
     */

    global.db.transaction( tx =>{
      tx.executeSql( 
        readingPocketQuery,
        null,
          (_,{ rows:{ _array }})=>{ 
            setCurrentBal( _array[0].currentBal )
          },
        ()=>{console.log('Failed to read pocket.')},
      )
    })
  }

  const insertCredit = ( credit_amount : number,  
                         credit_description : string ) => {
    /*
     * INSERTING INTO
     * CREDIT TABLE
     */

    let insertCreditQuery : string = 'INSERT INTO Credit( credit_amount,credit_description ) VALUES(?,?);'

    global.db.transaction( tx =>{
      tx.executeSql( 
                     insertCreditQuery,

                     [credit_amount,credit_description],

                     (_,txdb)=>{
                          // Calling Function
                          incrementPocket( credit_amount )
                          console.log('Successfully inserted data into credit.')
                      },
                     (_,err)=>{console.log('Error updating - ',err) }
                   )
    })
  }

  const incrementPocket = ( valueAdd : number ) => {
    /*
     * ADDING balance to 
     * current balance
     */

    let updatePocketQuery : string = 'REPLACE INTO Pocket(id,currentBal) VALUES(1,?)'

    global.db.transaction( tx =>{
      tx.executeSql( updatePocketQuery,
                     [currentBal + valueAdd],
                     (_,txdb)=>{
                         setCurrentBal( currentBal + valueAdd )
                         console.log('Updated data successfully.'),
                         setModalCreditVisible(false) 
                        },
                     (_,err)=>{console.log('Error updating - ',err) }
                   )
    })
  }
  // DATABASE SECTION ENDS 

  useEffect( ()=>{
  /*
   * FIRST THING HAPPEN
   * AFTER LOADING
   * THIS SCREEN
   */
    console.log('Inside useEffect of home.')
    readingPocket()
  },[])


  return (
    <View style={styles.homeStyle} >

      <ModalComponent
        submitBtnText='Credit'
        submitBtnColor='green'
        modalVisible={modalCreditVisible}
        setModalVisible={ (bool:boolean)=>{ setModalCreditVisible(bool) }}
        submitData={ (data1,data2)=>{ console.log('Parent get data - ',data1,data2)} }
      />

      <ModalComponent
        submitBtnText='Debit'
        submitBtnColor='red'
        modalVisible={modalDebitVisible}
        setModalVisible={ (bool:boolean)=>{ setModalDebitVisible(bool) }}
        submitData={ (data1,data2)=>{ console.log('Parent get data - ',data1,data2)} }
      />

      {/* MAIN BUTTON SECTION STARTS */}
      
      <View style={ styles.mainButtonContainer }>

        <ButtonSection 
          btnColor='#3ea832' 
          btnText='+' 
          callModal={(bool : boolean )=>{ setModalCreditVisible(bool) }} 
        />

        <ButtonSection 
          btnColor='#ff0022' 
          btnText='-' 
          callModal={(bool : boolean )=>{ setModalDebitVisible(bool) }} 
        />

        <ButtonSection 
          btnColor='black' 
          btnText='$' 
          callModal={(bool : boolean )=>{ navigation.navigate('transaction') }} 
        />
      </View>

      {/* MAIN BUTTON SECTION ENDS */}

      <Button title='Navigate' 
              onPress={ ()=>{ navigation.navigate('reading') }} />

      <Text style={ styles.currentBalStyle }> 
        Current Balance - {currentBal} Rs
      </Text>

    </View>)
};

const styles = StyleSheet.create({

  homeStyle : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor : 'white',
  },
  
  currentBalStyle : {
    margin : 10,
    padding : 5,
    fontSize : 25,
    borderRadius : 15,
    fontStyle : 'italic',
    color : 'white',
    backgroundColor : 'black',
    alignSelf : 'center',
  },

  mainButtonContainer : {
    flexDirection:'row',
    alignItems:'stretch',
    margin : 30
  },

});

export default HomeScreen;


