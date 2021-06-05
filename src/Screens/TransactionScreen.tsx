import React,{ useEffect, useState, useRef } from 'react';

import { View, 
         Text,
         TouchableOpacity,
         FlatList,
         RefreshControl,
         StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

// LOCAL
import NoDataFound          from '../components/NoDataFound';
import TransactionIcon      from '../components/Transaction/TransactionIcon';
import ActionSheet          from '../components/ActionSheet';
import RadioButton          from '../components/Transaction/RadioButton';

// DATABASE
import { credit }    from '../database_code/sqlQueries';
import queryExecutor from '../database_code/starterFunction';


const TransactionScreen = () => {

  // React STATE
  const [ refreshing, setRefreshing ]           = useState(false)
  const [ creditData, setCreditData ]           = useState([]);
  const [ showDescription, setShowDescription ] = useState(false)

  const [ description, setDescription ]         = useState('')
  const [ creditType, setCreditType ]           = useState('')
  const [ remainBal, setRemainBal ]             = useState([])

  const queryContainer = useRef('')

  const readingCredit = ( extraQuery:string )  =>  {
      /*
       * READING TABLE 
       */
      console.log( 'The value of query is - ',extraQuery )
      queryContainer.current = extraQuery
      queryExecutor( credit.readCreditQuery + extraQuery + credit._,
                     null,
                     'Credit-R',
                     databaseData=>{
                        setCreditData(databaseData) 
                      //{ databaseData.length !== creditData.length 
                      //    ? 
                      //  setCreditData(databaseData) 
                      //    : 
                      //  null
                      //}
                     }
                   )
  }


  const onRefresh = React.useCallback( ()=> {
   /*
    * because we want the old query value
    * for refreshing the page.
    */
   setRefreshing(true)
   readingCredit(queryContainer.current)
   setRefreshing(false)
   console.log('You refresh the page actually.')
    
  },[refreshing] )


  function actionDataSetter( isVisible        :boolean,
                             descriptionData  :string,
                             credit_type      :string,
                             remainBal        :number ){
    /*
     * Setting state for 
     * title,
     * description,
     * remain balance,
     */
    setShowDescription(isVisible),
    setDescription( descriptionData )
    setCreditType( credit_type )
    setRemainBal( [{ 
      'source_name': 'Remaining Balance - '+
                      remainBal.toString()+
                     ' Rs', 
      'id' : 1 
      }] 
    )
  }

  useEffect( ()=> {
    /*
     * we want all the data
     * of transaction 
     * on first time
     * opening app
     */
    readingCredit('2')
  },[])

  return (
    <View style={{ flex : 1}}>

      {/* CONDITIONAL CODE */}
      { creditData.length === 0 
          ?
        <NoDataFound 
          dataTitle='No Transaction Found !'
          dataDescription='Kindly add some data first'
          emojiName='emoji-sad' 
          emojiSize={84}
        />
          :

        <View style={ styles.homeStyle }>


          <Text style={{ fontSize : 20, textAlign : 'center'}}>
            All records
          </Text>

          {/* SEGMENT BUTTON */}
          <RadioButton 
            radioBtnClick={ (id:string)=>readingCredit(id) }
          />

          {/* SHOW DESCRIPTION MODAL */}
          <ActionSheet 
            sheetTitle       ={creditType.toUpperCase()+' Payment'}
            sheetDescription ={ description }
            listItemColor    ='#0095ff'
            sheetData        ={remainBal}
            sheetVisible     ={ showDescription }
            setSheetVisible  ={ (bool:boolean)=>setShowDescription(bool) }
            sheetSelectedItem={item=>setShowDescription(false)}
          />

          <FlatList 
            data={creditData}
            keyExtractor={ item=>item.id.toString() }
            refreshControl={
              <RefreshControl 
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            renderItem={(element)=>{
              return (
                <View style={styles.itemContainer}>

                  {/* Decide Icons */}
                  <TransactionIcon 
                    is_credit = {element.item.is_credit}
                  />
                  <View style={{ 'alignItems' : 'flex-end' }}>

                    <Text style={ styles.itemStyle }>
                      {element.item.credit_amount}Rs
                    </Text>
         
                    <TouchableOpacity onPress={ ()=>{
                                                 actionDataSetter(
                                                   true,
                                                   element.item.credit_description,
                                                   element.item.credit_type,
                                                   element.item.remain_bal,
                                                 )
                                              }}>
                      <MaterialCommunityIcons 
                        name="comment-eye-outline" 
                        size={24} 
                        color="black" 
                        style={{ paddingTop:5 }}
                      />
                    </TouchableOpacity>
                  </View>

                </View>
              )
            }}
          />
        </View>
      }
    </View>
  )  
};

const styles = StyleSheet.create({

  homeStyle : {
    flex : 1,
    alignItems : 'stretch',
    marginHorizontal : 20,
    fontSize : 40,
  },

  itemContainer : {
    flexDirection : 'row',
    padding : 10,
    marginVertical : 10,
    //borderWidth : 1,
    //borderColor : 'black',
    borderRadius : 8,
    backgroundColor : '#ffe6b5',
    shadowColor : 'black',
    shadowOffset : { width:0, height:9 },
    shadowOpacity : 0.9,
    elevation : 4,
    shadowRadius : 2,
    justifyContent : 'space-between',
  },

  itemStyle : {
    fontSize : 17,
    fontWeight : 'bold',
  },

  itemDescription : {
    fontSize : 13,
    fontWeight : 'bold',
    textTransform : 'capitalize',

  }


});

export default TransactionScreen;
