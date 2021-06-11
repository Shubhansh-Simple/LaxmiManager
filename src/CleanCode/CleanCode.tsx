/*
 * In this file, Common requirement 
 * through entire application 
 * full by these functions
 * for making our real code more
 * readable and understandable.
 */

export function listItemMaker( item_name : string,
                               item_id   : string ,
                               item_description_start : string = '',
                               item_description_end   : string = '',
                             ) {
  /*
   * this returns the data
   * as per flatlist iteration
   */
  return [{
    source_name : item_description_start + ' ' + 
                  item_name + ' ' + 
                  item_description_end,
    id          : item_id
  }]
}




