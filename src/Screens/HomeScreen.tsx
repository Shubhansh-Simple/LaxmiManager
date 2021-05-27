import React, {useState,useEffect} from 'react';

import { View, 
         Text,
         StyleSheet } from 'react-native';

import  {FontAwesome5 } from '@expo/vector-icons'; 

// LOCAL
import ButtonComponent from '../components/ButtonComponent';
import ModalComponent  from '../components/ModalComponent';
//import StraightLine    from '../components/StraightLine';

// DATABASE
import { pocket, credit, source } from '../database_code/sqlQueries';
import queryExecutor              from '../database_code/starterFunction';


const HomeScreen = ()  =>  {

  /*****************
   * REACT'S STATE *
   *****************/

  const [ currentBal, setCurrentBal ]     =  useState(0);
  const [ sourceOptions, setSourceOptions ] = useState([])

  // MODAL's STATE
  const [ modalCreditVisible, setModalCreditVisible ] = useState(false);
  const [ modalDebitVisible,  setModalDebitVisible  ] = useState(false);


  /*********************
   * DATABASE FUNCTION *
   *********************/
 
  const readingPocket = ()  =>  {
    /*
     * READING Pocket
     * table
     */
    queryExecutor( pocket.readPocketQuery+' WHERE id=1',
                   null,
                   'Pocket-R',
                   databaseData => setCurrentBal(databaseData[0].currentBal)
                 )
  }

  const insertCredit = ( credit_amount : number,  
                         credit_description : string,
                         credit_type : string,
                         is_credit : boolean,
                         source_name : number )=>{
    /*
     * INSERTING INTO
     * CREDIT TABLE
     */
    queryExecutor( credit.insertCreditQuery,
                   [credit_amount, credit_description, credit_type, is_credit, source_name ],
                   'Credit-I',
                   databaseData => insertPocket( credit_amount,is_credit )
                 )
  }


  const insertPocket = ( value:number, is_credit:boolean )  =>  {
    /*
     * CREDIT/DEBIT 
     * balance to 
     * current balance
     */
    var currentAmount =  is_credit ? currentBal+value : currentBal-value

    queryExecutor( pocket.updatePocketQuery,
                   [ currentAmount ],
                   'Pocket-U',
                   databaseData => { 
                         setCurrentBal( currentAmount )
                         console.log('Updated data successfully.'),
                         setModalCreditVisible(false)
                   }
                 )
  }

  const readingSource = () => {
    /*
  	 * READING FROM
  	 * SOURCE TABLE
  	 */

    queryExecutor( source.readSourceQuery,
                   null,
                   'Source-R',
                   databaseData=>{
                     setSourceOptions(databaseData)
                     console.log('Data from source table - ',databaseData)
                   }
                 )
  }

  // DATABASE SECTION ENDS 

  useEffect( () => {
  /*
   * FIRST THING HAPPEN
   * AFTER LOADING
   * THIS SCREEN
   */
    console.log('Inside useEffect of home.')
    readingPocket()
    readingSource()
  }, [modalCreditVisible,modalDebitVisible])


  return (
    <View style={styles.homeStyle} >

      <Text style={{ 
        fontSize:40,
        color : 'white',
        fontStyle : 'italic',
        fontWeight : '400',
      }}>
        Laxmi Tracker 
      </Text>
      <FontAwesome5 
        name='comments-dollar' 
        size={110}
        color='white'
      />

      {/*CREDIT MODAL*/}
      <ModalComponent
        modalTitle     ='Add Credit'
        submitBtnText  ='Credit'
        submitBtnColor ='#34b518'
        sourceOptions  ={ sourceOptions }
        modalVisible   ={modalCreditVisible}
        setModalVisible={ (bool:boolean)=>setModalCreditVisible(bool) }
        submitData     ={ (data1,data2,data3,data4)=>insertCredit(+data1,data2,data3,true,+data4) }
      />

      {/*DEBIT MODAL*/}
      <ModalComponent
        modalTitle     ='Add Expense'
        submitBtnText  ='Debit'
        submitBtnColor ='red'
        sourceOptions  ={ sourceOptions }
        modalVisible   ={modalDebitVisible}
        setModalVisible={ (bool:boolean)  =>  setModalDebitVisible(bool) }
        submitData     ={ (data1,data2,data3,data4)=>insertCredit(+data1,data2,data3,false,+data4) }
      />

      <View style={{ flexDirection : 'row', marginHorizontal : 10, }}>
        <View style={{ 
          borderBottomWidth : 1, 
          borderBottomColor : 'white',
          alignSelf: 'stretch',
          width : '20%',
        }}>
        </View>
        <Text style={{ 
          fontSize : 20,
          color : '#bd1368',
          marginHorizontal : 20,
          top : 10,
          fontStyle : 'italic',
        }}>
          Navigator 
        </Text>
        <View style={{ 
          borderBottomWidth : 1, 
          borderBottomColor : 'white',
          alignSelf: 'stretch',
          width : '20%',
        }}>
        </View>
      </View>


      {/* MAIN BUTTON SECTION STARTS */}
      
      <View style={ styles.mainButtonContainer }>

        <ButtonComponent 
          btnColor='#3ea832' 
          btnText='Increment' 
          iconName='plus' 
          callModal={(bool : boolean ) => setModalCreditVisible(bool)} 
        />

        <ButtonComponent 
          btnColor='#ff0022' 
          btnText='Decrement' 
          iconName='minus' 
          callModal={(bool : boolean ) => setModalDebitVisible(bool)} 
        />

      </View>

      {/* MAIN BUTTON SECTION ENDS */}

      <View style={ styles.currentBalParentContainer }>

        <View style={ styles.currentBalContainer }>
          <Text style={ styles.currentBalStyle }> Cash </Text>
          <Text style={ styles.currentBalStyle }> {currentBal} Rs </Text>
        </View>

        <View style={ styles.currentBalContainer }>
          <Text style={ styles.currentBalStyle }> Online </Text>
          <Text style={ styles.currentBalStyle }> {currentBal} Rs </Text>
        </View>   

        <View style={ styles.currentBalContainer }>
          <Text style={ styles.currentBalStyle }> Total Balance </Text>
          <Text style={ styles.currentBalStyle }> {currentBal} Rs </Text>
        </View>

      </View>

    </View>
  )
};

const styles = StyleSheet.create({

  homeStyle : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor : '#272b28',
  },

  currentBalParentContainer : { 
    backgroundColor:'#393b39', 
    borderRadius : 20,
    marginVertical : 10,
    alignSelf : 'stretch'
  },

  currentBalContainer : {
    alignSelf : 'stretch',
    flexDirection : 'row',
    justifyContent : 'space-between',
  },
  
  currentBalStyle : {
    padding : 15,
    fontSize : 20,
    color : 'white',
    textAlignVertical : 'center',
    fontStyle : 'italic',
    textAlign : 'center',
  },

  mainButtonContainer : {
    flexDirection:'row',
    alignItems:'stretch',
    marginHorizontal : 30,
    marginVertical : 20,
  },

});

export default HomeScreen;


