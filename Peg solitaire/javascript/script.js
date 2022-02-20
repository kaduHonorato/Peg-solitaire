// Constants created from HTML TAGS;

const tag_main_screen = document.querySelector("#main_screen");
const tag_ranking_screen = document.querySelector("#ranking_screen");
const tag_credits_screen = document.querySelector("#credits_screen");
const tag_pause_screen = document.querySelector("#pause_screen");
const tag_end_game_screen = document.querySelector("#end_game_screen");

const tag_ranking_screen_table = document.querySelector("#ranking_screen_table");
const tag_end_game_screen_table = document.querySelector("#end_game_screen_table");

const tag_end_game_screen_title = document.querySelector("#end_game_screen .title");

const tag_no_data_message = document.querySelector("#no_data_message");

const tag_game_container = document.querySelector("#game_container");

const tag_remain_pieces_txt = document.querySelector("#remain_pieces_txt");
const timer_value = document.querySelector("#timer_value");

const tag_btn_start_game = document.querySelector("#btn_start_game");
const tag_btn_open_ranking_screen = document.querySelector("#btn_open_ranking_screen");
const tag_btn_open_credits_screen = document.querySelector("#btn_open_credits_screen");

const tag_btn_pause_game = document.querySelector("#btn_pause_game");
const tag_btn_resume_game = document.querySelector("#btn_resume_game");

const tag_btn_reset_game = document.querySelector("#btn_reset_game");
const tag_btn_exit_game = document.querySelector("#btn_exit_game");


const tag_btn_save_game_result = document.querySelector("#btn_save_game_result");

const tag_btn_close_ranking_screen = document.querySelector("#btn_close_ranking_screen");
const tag_btn_close_credits_screen = document.querySelector("#btn_close_credits_screen");

const tag_puzzle_blocks_box = document.querySelector("#puzzle_blocks_box"); 
const tag_pieces_box = document.querySelector("#pieces_box"); 

const tag_timer = document.querySelector("#timer"); 

const tag_table_row_template = document.querySelector("#table_row_template");


// =============================================================================================

Game();

// =============================================================================================

function Game()
{
          
    // ----------------------------------------------------------------

    var victory = false;
    var end_game = false;
    var remain_pieces = 32;
    var timer = new Timer();

    var local_storage_data = new Local_storage_data(1,"ranking_data");
    var ranking_data = local_storage_data.load();

    var matriz_board = [[],[],[],[],[],[],[]];
    var matriz_possible_moves = [];
    var last_player_id = -1; 

    var selected_piece_pos_y;
    var selected_piece_pos_x;

    var selected_empty_space_pos_y;
    var selected_empty_space_pos_x;

    var removed_piece_pos_y;
    var removed_piece_pos_x;
           
    engine_set_main_events(); 
  
    // ----------------------------------------------------------------

    function engine_set_main_events()
    {
        
        tag_btn_open_ranking_screen.addEventListener("click",engine_open_ranking_screen);
        tag_btn_close_ranking_screen.addEventListener("click",engine_close_ranking_screen); 

        tag_btn_open_credits_screen.addEventListener("click",engine_open_credits_screen);
        tag_btn_close_credits_screen.addEventListener("click",engine_close_credits_screen);
        
        tag_btn_start_game.addEventListener("click",engine_start_game);
        tag_btn_pause_game.addEventListener("click",engine_pause_game);
        tag_btn_reset_game.addEventListener("click",engine_reset_game);
        tag_btn_resume_game.addEventListener("click",engine_resume_game);
        tag_btn_exit_game.addEventListener("click",engine_exit_game);
   
    }  

    // ----------------------------------------------------------------
    
    function engine_start_game()
    {
       change_current_screen((end_game) ? null : tag_main_screen.parentElement,null);
       
        
        victory = false;
        end_game = false;

        remain_pieces = 32;
    
        timer.start_time = new Date();

        Set_element_disabled(tag_btn_pause_game,false);


        Set_element_txt(timer_value,`00:00:00`);
        Set_element_txt(tag_remain_pieces_txt,remain_pieces);
        
        timer.set_timer_counter(engine_update_timer);
          
        engine_load_pieces();
    
        Set_element_attribute(tag_puzzle_blocks_box,"open","true");
        tag_pieces_box.scrollIntoView();
    }

    // ----------------------------------------------------------------

    function engine_load_ranking()
    {
        const tag_table_body = tag_ranking_screen_table.querySelector("tbody");
        
        Remove_element_children(tag_table_body);

      
        
            ranking_data = local_storage_data.load();
              
                 
            for(const row_data of ranking_data)
            {
                const tag_table_row_copy = document.importNode(tag_table_row_template.content,true);
                const tag_table_row = tag_table_row_copy.querySelector("tr");

                const tag_player_pos_cell = tag_table_row.querySelector(".player_pos_cell");
                const tag_player_name_cell = tag_table_row.querySelector(".player_name_cell");
                const tag_game_remain_pieces_cell = tag_table_row.querySelector(".game_remain_pieces_cell");
                const tag_game_time_cell = tag_table_row.querySelector(".game_time_cell");
                const tag_date_cell = tag_table_row.querySelector(".date_cell");
                                
                
                var [id,position,name,remain_pieces,time,date] = row_data; 
                
                var [hours,minutes,seconds] = timer.format_milliseconds(time);

                date = new Date(date);

                var [year,month,day] = [date.getFullYear(),date.getMonth(),date.getDate()];

                month++;

                [year,month,day] = timer.add_zero([year,month,day]);

                Remove_class(tag_player_pos_cell,"display_none");
                
              
                                    
                Set_element_txt(tag_player_pos_cell,`${position}º`);
                Set_element_txt(tag_player_name_cell,name);
                Set_element_txt(tag_game_remain_pieces_cell,remain_pieces);
                Set_element_txt(tag_game_time_cell,`${hours}:${minutes}:${seconds}`);
                Set_element_txt(tag_date_cell,`${year}/${month}/${day}`);

                Add_element_child(tag_table_body,tag_table_row_copy);

                if(id == last_player_id)
                {   
                    last_player_id = -1;  
                    
                    Add_class(tag_table_row,"golden_row");
                } 
               
            }
                  
           const tag_golden_row = tag_table_body.querySelector(".golden_row");

           if(tag_golden_row)
                tag_golden_row.scrollIntoView();
          
      }
    
    // ================================================================

    function engine_open_ranking_screen()
    {
       
        engine_load_ranking();
        
        change_current_screen((end_game) ? tag_end_game_screen.parentElement : tag_main_screen.parentElement,tag_ranking_screen.parentElement);
        
        Add_class((ranking_data.length) ? tag_no_data_message : tag_ranking_screen_table.parentElement,"display_none"); 
    
    }

    // ================================================================

    function engine_close_ranking_screen()
    {
        change_current_screen(tag_ranking_screen.parentElement,(end_game) ? null : tag_main_screen.parentElement);

        if(end_game)
            Set_element_attribute(tag_puzzle_blocks_box,"open");    

        Remove_class((ranking_data.length) ? tag_no_data_message : tag_ranking_screen_table.parentElement,"display_none"); 
    }

    // ================================================================

    function engine_open_credits_screen()
    {
        change_current_screen(tag_main_screen.parentElement,tag_credits_screen.parentElement);
    }

    // ================================================================

    function engine_close_credits_screen()
    {
        change_current_screen(tag_credits_screen.parentElement,tag_main_screen.parentElement);
    }

    // ================================================================

    function engine_open_end_game_screen()
    {
        change_current_screen(null,tag_end_game_screen.parentElement);
    }

    // ================================================================

    function engine_pause_game(ev)
    {
        new Audio("media/pause.wav").play();

        change_current_screen(null,tag_pause_screen.parentElement);
            
        Set_element_disabled(ev.target,true);
        Set_element_disabled(tag_btn_resume_game,false);

        timer.pause_timer(); 
    }

    // ================================================================

    async function engine_reset_game()
    {
     
        timer.pause_timer(); 
            
        if(end_game || await Message.confirm_box("Are you sure that you want to start a new game?")) 
        {
            
            Remove_element_children(tag_pieces_box);

            engine_start_game();
         
        }
        else
            timer.resume_timer(engine_update_timer);

    }

    // ================================================================

    function engine_resume_game(ev)
    {
        new Audio("media/resume.wav").play();
        
        change_current_screen(tag_pause_screen.parentElement,null);
            
        Set_element_disabled(ev.target,true);
        Set_element_disabled(tag_btn_pause_game,false);

        timer.resume_timer(engine_update_timer);

    }

    // ================================================================

    async function engine_exit_game()
    {
        timer.pause_timer(); 
            
        if(end_game || await Message.confirm_box("Are you sure that you want to exit?")) 
        {
             victory = false;
             end_game = false;

             remain_pieces = 32;
          
            
             
             change_current_screen(null,tag_main_screen.parentElement);
             
             Remove_element_children(tag_pieces_box);
            
             Set_element_txt(timer_value,`00:00:00`);      
             
             Set_element_txt(tag_remain_pieces_txt,"32");   
             
             Remove_element_attribute(tag_puzzle_blocks_box,"open");
        }
        else
            timer.resume_timer(engine_update_timer);
        

    }

    // ================================================================

    function change_current_screen(screen_out,screen_in)
    {
        if(screen_out)
            Add_class(screen_out,"visibility_hidden");
            
        if(screen_in)
            Remove_class(screen_in,"visibility_hidden");
    }

    // =================================================================

    function engine_update_timer()
    {
      
        timer.update_passed_time();
        
        var[hours,minutes,seconds] = timer.format_milliseconds(timer.passed_time);          

        Set_element_txt(timer_value,`${hours}:${minutes}:${seconds}`);
  
    }

   // ================================================================
    
    function engine_load_pieces()
    {
        matriz_board = build_blocks(); 
          
        
        render_pieces();
    
        set_active_pieces();
        
        
    // ---------------------------------------------------------------

    function build_blocks()
    {
        var matriz_blocks = [[],[],[],[],[],[],[]];
     

        for(var y = 0; y < 7; y++)
        {
          
            for(var x = 0; x < 7; x++)
            {
                var block_class_name = (
                                        ((x < 2) || (x > 4)) && ((y < 2) || (y > 4))
                                       ) ? "blocked" :
                                       (
                                        ((y == 3) && (x == 3))
                                       ) ? "empty" : "piece"; 
  
                matriz_blocks[y][x] = create_piece_html_tag(block_class_name,y,x) 
                                            
            }

        }           
        
        return matriz_blocks;
    }

    // ---------------------------------------------------------------

    function create_piece_html_tag(block_class_name,y,x)
    {        
         const tag_block = Create_element("div");

         Add_class(tag_block,block_class_name);

         Set_element_dataset(tag_block,"posY",y);
         Set_element_dataset(tag_block,"posX",x);

         if(block_class_name != "blocked")
            Add_element_child(tag_block,Create_element("div"));
             
         return tag_block;
    }
       

    // ================================================================

    function render_pieces()
    {
        matriz_board.forEach(line => 
        {
            line.forEach(block => 
            {
                Add_element_child(tag_pieces_box,block); 
            });
            
        });
    }

    // ================================================================
  
    function set_active_pieces()
    {

      selected_piece_pos_y = -1;
      selected_piece_pos_x = -1;
    
      selected_empty_space_pos_y = -1;
      selected_empty_space_pos_x = -1;
    
      removed_piece_pos_y = -1;
      removed_piece_pos_x = -1;


      var matriz_empty_spaces = pick_pos_by_class("empty"); 
               
      var active_pieces_possible_moves = [];

      matriz_empty_spaces.forEach((array_empty_spaces) => 
      {                

         var [empty_space_pos_y,empty_space_pos_x] = array_empty_spaces;
      


         active_pieces_possible_moves.push
         (
            {
                logic_test: ((empty_space_pos_y - 2) > -1) && 
                            (matriz_board[empty_space_pos_y - 1][empty_space_pos_x].classList.contains("piece")) &&
                            (matriz_board[empty_space_pos_y - 2][empty_space_pos_x].classList.contains("piece")),
                
                possible_move_positions: [empty_space_pos_y,empty_space_pos_x],    
                active_piece_positions: [empty_space_pos_y - 2,empty_space_pos_x],
                removed_piece_positions: [empty_space_pos_y - 1,empty_space_pos_x],
             
                
            }
         );

         // ----------------------------------------------------------------------------------------------------------------------------

         active_pieces_possible_moves.push
         (
            {
                logic_test: ((empty_space_pos_y + 2) < matriz_board.length) && 
                            (matriz_board[empty_space_pos_y + 1][empty_space_pos_x].classList.contains("piece")) &&
                            (matriz_board[empty_space_pos_y + 2][empty_space_pos_x].classList.contains("piece")),
                
                possible_move_positions: [empty_space_pos_y,empty_space_pos_x],   
                active_piece_positions: [empty_space_pos_y + 2,empty_space_pos_x],
                removed_piece_positions: [empty_space_pos_y + 1,empty_space_pos_x],
             
               
            }
         );

        // ----------------------------------------------------------------------------------------------------------------------------
            
         active_pieces_possible_moves.push
         (
            {
                logic_test: ((empty_space_pos_x - 2) > -1) && 
                            (matriz_board[empty_space_pos_y][empty_space_pos_x - 1].classList.contains("piece")) &&
                            (matriz_board[empty_space_pos_y][empty_space_pos_x - 2].classList.contains("piece")),
              
                possible_move_positions: [empty_space_pos_y,empty_space_pos_x],   
                active_piece_positions: [empty_space_pos_y,empty_space_pos_x - 2],
                removed_piece_positions: [empty_space_pos_y,empty_space_pos_x - 1],
             
                
            }
         );

        // ----------------------------------------------------------------------------------------------------------------------------

        active_pieces_possible_moves.push
        (
           {
               logic_test: ((empty_space_pos_x + 2) <  matriz_board[empty_space_pos_y].length) && 
                           (matriz_board[empty_space_pos_y][empty_space_pos_x + 1].classList.contains("piece")) &&
                           (matriz_board[empty_space_pos_y][empty_space_pos_x + 2].classList.contains("piece")),
                possible_move_positions: [empty_space_pos_y,empty_space_pos_x],   
                active_piece_positions: [empty_space_pos_y,empty_space_pos_x + 2],
                removed_piece_positions: [empty_space_pos_y,empty_space_pos_x + 1],
               
               
           }
        );

        // ----------------------------------------------------------------------------------------------------------------------------
             
      }
    );

    matriz_possible_moves = [];
    
        for(var active_piece_possible_move of active_pieces_possible_moves)
        {
            if(active_piece_possible_move.logic_test)
            {
              
                matriz_possible_moves.push({
                                            active_piece_positions: active_piece_possible_move.active_piece_positions,
                                            possible_move_positions: active_piece_possible_move.possible_move_positions,
                                            removed_piece_positions: active_piece_possible_move.removed_piece_positions,
                                          
                                            });
                
                var [active_piece_pos_y,active_piece_pos_x] = active_piece_possible_move.active_piece_positions;
                
                if(!(matriz_board[active_piece_pos_y][active_piece_pos_x].classList.contains("active")))
                {
                  
                    Add_class(matriz_board[active_piece_pos_y][active_piece_pos_x],"active");
                                    
                    matriz_board[active_piece_pos_y]
                                [active_piece_pos_x].addEventListener("click",select_piece);
                    
                }
               
                         
            }

        }
    }  
     
    // ==========================================================================================================
      
        function select_piece(ev)
        {
      

            const tag_piece = (ev.target.classList.contains("active")) ? ev.target : ev.target.parentElement;

            if((selected_piece_pos_y != -1) && (selected_piece_pos_x != -1))
            {
     
                if(tag_piece.classList.contains("selected"))
                {

                    engine_reset_active_blocks();
                    set_active_pieces();
                               
                    return;
                
                }
                else
                {
                    engine_reset_active_blocks();
                    set_active_pieces();
                }
            }
                    
            new Audio("media/select.wav").play();
         
            
           Add_class(tag_piece,"selected");  
           
           [selected_piece_pos_y,selected_piece_pos_x] = [+Get_element_dataset(tag_piece,"posY"),+Get_element_dataset(tag_piece,"posX")];

     
            matriz_possible_moves.filter((array_possible_moves) => 
            {
         

                return array_possible_moves.active_piece_positions[0] == selected_piece_pos_y &&
                       array_possible_moves.active_piece_positions[1] == selected_piece_pos_x;

            }).forEach((array_possible_moves) => 
            {
               var[possible_move_pos_y,possible_move_pos_x] = array_possible_moves.possible_move_positions;

              
               Add_class(matriz_board[possible_move_pos_y][possible_move_pos_x],"possible_move");

               matriz_board[possible_move_pos_y]
                           [possible_move_pos_x].addEventListener("click",move_piece); 
                               
      
        });

      
                      
    }

    // ------------------------------------------------------------------------------------------------------------------------------

    function pick_pos_by_class(cls)
    {
       return matriz_board.flatMap(block => block)
                          .filter((block) => block.classList.contains(cls))
                          .map((block) => 
                          {
                              return[
                                        +Get_element_dataset(block,"posY"), 
                                        +Get_element_dataset(block,"posX") 
                                    ];        
                          });                       
     

    }

    // -----------------------------------------------------------------------------------------------------------------------------

    function move_piece(ev)
    {

        new Audio("media/move.mp3").play();

        engine_reset_active_blocks();
     
        // -----------------------------------------------------------------------------------------------------------------------------

        Set_element_txt(tag_remain_pieces_txt,--remain_pieces);

        const tag_empty_space =  (ev.target.classList.contains("empty")) ? ev.target : ev.target.parentElement;
    

        [selected_empty_space_pos_y,selected_empty_space_pos_x] = [
                                                                   +Get_element_dataset(tag_empty_space,"posY"),
                                                                   +Get_element_dataset(tag_empty_space,"posX")
                                                                  ]; 
      
        // -----------------------------------------------------------------------------------------------------------------------------
        
        var [,,removed_piece_positions] = Object.values(

        matriz_possible_moves.find((array_possible_move) => 
        {
            return (array_possible_move.active_piece_positions[0] == selected_piece_pos_y) &&
                   (array_possible_move.active_piece_positions[1] == selected_piece_pos_x) &&
                   (array_possible_move.possible_move_positions[0] == selected_empty_space_pos_y) &&
                   (array_possible_move.possible_move_positions[1] == selected_empty_space_pos_x);
        })                                                        

        );

        [removed_piece_pos_y,removed_piece_pos_x] = removed_piece_positions;
       
        Remove_class(matriz_board[selected_piece_pos_y][selected_piece_pos_x],"piece");
        Add_class(matriz_board[selected_piece_pos_y][selected_piece_pos_x],"empty");

        Remove_class(matriz_board[selected_empty_space_pos_y][selected_empty_space_pos_x],"empty");
        Add_class(matriz_board[selected_empty_space_pos_y][selected_empty_space_pos_x],"piece");
           
        Remove_class(matriz_board[removed_piece_pos_y][removed_piece_pos_x],"piece");
        Add_class(matriz_board[removed_piece_pos_y][removed_piece_pos_x],"empty");
          
        Remove_element_children(tag_pieces_box);
            
        render_pieces();
            
        set_active_pieces();

        engine_check_end_game();
                  
    }

    // -----------------------------------------------------------------------------------------------------------------------------

    function engine_check_end_game()
    {
        end_game = (tag_pieces_box.querySelectorAll(".active").length == 0);

        if(end_game)
        {
           
            timer.pause_timer();
                      
            victory = check_victory();

            window.setTimeout(engine_finish_game,500);

        }    

    }

    // -----------------------------------------------------------------------------------------------------------------------------

    async function engine_finish_game()
    {

        if(victory)
            new Audio("media/win.mp3").play();
               
        Set_element_txt(tag_end_game_screen_title,"GAME OVER");

        Remove_element_attribute(tag_puzzle_blocks_box,"open");        
              
        const tag_table_body = tag_end_game_screen_table.querySelector("tbody");

        var[hours,minutes,seconds] = timer.format_milliseconds(timer.passed_time);
        
        var total_seconds = ((hours * 3600)  + (minutes * 60) + (seconds));

        var [year,month,day] = [timer.current_time.getFullYear(),timer.current_time.getMonth(),timer.current_time.getDate()];

        month++;
        
        [year,month,day] = timer.add_zero([year,month,day]);

        const tag_table_row_copy = document.importNode(tag_table_row_template.content,true);
        const tag_table_row = tag_table_row_copy.querySelector("tr");
        
        const tag_player_name_cell = tag_table_row.querySelector(".player_name_cell");
        const tag_game_remain_pieces_cell = tag_table_row.querySelector(".game_remain_pieces_cell");
        const tag_game_time_cell = tag_table_row.querySelector(".game_time_cell");
        const tag_date_cell = tag_table_row.querySelector(".date_cell");

        const tag_input_text = Create_element("input");

        Set_element_attribute(tag_input_text,"type","text");
        Set_element_attribute(tag_input_text,"maxlength","20");
        Set_element_attribute(tag_input_text,"placeholder","put your name here");

        Add_element_child(tag_player_name_cell,tag_input_text);

        Set_element_txt(tag_game_time_cell,`${hours}:${minutes}:${seconds}`);
        Set_element_txt(tag_game_remain_pieces_cell,remain_pieces);
        Set_element_txt(tag_date_cell,`${year}/${month}/${day}`);

        Add_element_child(tag_table_body,tag_table_row_copy);
       
        engine_open_end_game_screen();

        tag_input_text.focus();

        Set_element_disabled(tag_btn_pause_game,true);
       
        Set_element_disabled(tag_btn_save_game_result,false);

        tag_btn_save_game_result.addEventListener("click",Engine_save_player_data);
        
        
        function Engine_save_player_data()
        {
          
        var player_data = [];

        const pick_unique_id =  () => { 
                                            var ids = ranking_data.map(data => data[0]);
                                            var new_id;        
            
                                            do
                                            {
                                            new_id = Generate_random_number(1,(ids.length + 10000));                     
                                            }
                                            while(ids.indexOf(new_id) != -1);

                                            return new_id;

                                       };

        
        player_data[0] = pick_unique_id(); // ID

        player_data[1] = -1;               // POS
        player_data[2] = (Get_element_value(tag_input_text).trim().length) ? Get_element_value(tag_input_text).trim() :   // NAME
                                                                                   "Unknow Player";                     
        player_data[3] = remain_pieces;  // REMAIN PIECES
        player_data[4] = (total_seconds * 1000); // TIME
     
        player_data[5] =  `${year}/${month}/${day}`;

        last_player_id = player_data[0];
          
        ranking_data.push(player_data);
           
        ranking_data = sort_ranking_data();
     
        local_storage_data.save(ranking_data);
           
        engine_open_ranking_screen();
        
        Remove_element(tag_table_row);
        
        tag_btn_save_game_result.removeEventListener("click",Engine_save_player_data);

        } 
                                                 
    }
    
    // =========================================================================================

    function sort_ranking_data()
    {

        const pick_data = (array_data,data,index) => 
        {                        
            (array_data.indexOf(data[index]) == -1) ? array_data.push(data[index]) : null; 
            
            return array_data; 
        }
        
        // -------------------------------------------------------------------------------

        const pick_times = (array_data,data) =>
        {
            return pick_data(array_data,data,3); 
        } 

        // -------------------------------------------------------------------------------

        const pick_remain_pieces = (array_data,data) =>
        {
            return pick_data(array_data,data,3); 
        } 

        // -------------------------------------------------------------------------------

        const sort_data = (dt_1, dt_2) => dt_1 - dt_2;

        // --------------------------------------------------------------------------------

        const sort_data_by_time = (player_1,player_2) =>
        {
            return sort_data(player_1[4],player_2[4]);
        }

        // --------------------------------------------------------------------------------
 
                
        const filter_data_by_param = (array_data,param,index) =>
        {
            var data = ranking_data.filter(data => data[index] == param);

            if(data.length)
            {   
                array_data.push(data);
            }

            return array_data;
        }

       // --------------------------------------------------------------------------------
   
        const filter_data_by_remain_pieces = (array_data,param) =>
        {
            return filter_data_by_param(array_data,param,3);
        } 
    
        // --------------------------------------------------------------------------------
  
        function enumerate_data(data,index,array)
        {
         
          if(index)
          {
              data[1] = (
                                     (array[index - 1][3] == data[3]) && 
                                     (array[index - 1][4] == data[4])
                        )  ?   
                            current_pos 
                           : 
                            current_pos += array.filter(dt =>   (
                                                                    (array[index - 1][3] == dt[3]) && 
                                                                    (array[index - 1][4] == dt[4])
                                                                )
                                                       ).length;
                                                                                                    
          }     
          else  
          {     
                data[1] = current_pos;
          }
         
          return data;
            
        }
          
        // --------------------------------------------------------------------------------
        
        var current_pos = 1;

 

       
                        return ranking_data.reduce(pick_remain_pieces,[]) // Pick remain pieces
                                           .sort(sort_data)       // sort all remain_pieces
                                           .reduce(filter_data_by_remain_pieces,[]) // group data by remain pieces
                                           .map((data) => data.sort(sort_data_by_time)) // sort data by moves
                                           .flatMap(data => data) // turn the matriz in array
                                           .map(enumerate_data); // set positions
                                                                    
        
                               
                                              
      
    }

     // =========================================================================================

    function engine_reset_active_blocks()
    {

        matriz_board = matriz_board.map((line) => 
        {
            return line.map((block) => 
            {

                if(block.classList.contains("selected"))
                {
                   Remove_class(block,"selected");
                }


                if(block.classList.contains("active"))
                {
                    block.removeEventListener("click",select_piece);
                    Remove_class(block,"active");
                }

                if(block.classList.contains("possible_move"))
                {
              
                    block.removeEventListener("click",move_piece);
                    Remove_class(block,"possible_move");
                }

                  return block;

                });

            });  
 
    }

    // -----------------------------------------------------------------------------------------------------------------------------
  
    function check_victory()
    {              
     
     return (remain_pieces == 1);
    
    }

    // -----------------------------------------------------------------------------------------------------------------------------

}

}

// =====================================================================================================================================



// Default Functions;

// ======================================================================================================================================

function Set_element_value(element,val)
{
    element.value = val;
}
    
// =========================================================================================

function Get_element_value(element)
{
    return element.value;
}

// =========================================================================================


function Add_class(element,cls)
{   
    element.classList.add(cls);
}

// ========================================================================================

function Remove_class(element,cls)
{

    element.classList.remove(cls);
    
}

// ==========================================================================================

function Add_element_attribute(element,attribute)
{
    element.setAttributeNode(attribute);
}

// ==========================================================================================

function Set_element_attribute(element,attr,val)
{
    element.setAttribute(attr,val);
            
}
    
// ===========================================================================================

function Create_attribute(attribute)
{
    return document.createAttribute(attribute);
}

// ===========================================================================================

function Get_element_attribute(element,attr)
{
   return element.getAttribute(attr);
        
}

// ===========================================================================================

function Remove_element_attribute(element,attr)
{
    element.removeAttribute(attr);
}
    
// ============================================================================================

function Set_element_txt(element,txt)
{
    element.textContent = txt;
}

// ============================================================================================

function Get_element_txt(element)
{
    return element.textContent;
}

// ============================================================================================

function Set_element_disabled(element,disabled = false)
{
    element.disabled = disabled;
}
        
// ============================================================================================

function Generate_random_number(num_1,num_2)
{
    var random_number = num_1 + (Math.round(Math.random() * (num_2 - num_1)));
    
    return random_number;
    
}

// ===========================================================================================

function Create_element(element)
{
    return document.createElement(element);
}   

// ===========================================================================================

function Add_element_child(element,child)
{
    element.appendChild(child);
}

// ===========================================================================================

function Set_element_dataset(element,dataset_name,value)
{
    element.dataset[dataset_name] = value;
}

// =========================================================================================

function Get_element_dataset(element,dataset_name)
{
    return element.dataset[dataset_name];
}

// ========================================================================================

function Remove_element_dataset(element,dataset_name)
{
    delete element.dataset[dataset_name];
}

// ========================================================================================

function Call_function_helper(func,elements,param = null)
{
    for(const element of elements)
    {    
        if(param)
            func(element,param);
        else
            func(element);  
    } 
}

// ===========================================================================================

function Create_event_helper(elements,event,func,param = null)
{
    for(const element of elements)
    {
                        
        if(param)
            element.addEventListener(event,() => { func(param);});
        else
            element.addEventListener(event,func);
          
     }
}

// ===========================================================================================


function Remove_element(element)
{
    element.remove(); 
}

// ============================================================================================

function Remove_element_children(element)
{
    while(element.childElementCount)
        Remove_element(element.lastChild);
}

// ============================================================================================



    /*
          

        board[valid_move.active_piece_pos_y]
             [valid_move.active_piece_pos_x]
             .style.transform = "translate(" + valid_move.movement[0] + "px," + valid_move.movement[1] + "px)";

        var movement_empty_space_x = (valid_move.movement[0]) ?  valid_move.movement[0] * -1 : valid_move.movement[0];
        var movement_empty_space_y = (valid_move.movement[1]) ?  valid_move.movement[1] * -1 : valid_move.movement[1];

        board[empty_space_y][empty_space_x].style.transform = "translate(" +  movement_empty_space_x + "px," +  movement_empty_space_y + "px)"; 

        Set_element_dataset(board[valid_move.active_piece_pos_y][valid_move.active_piece_pos_x],"x",empty_space_x);
        Set_element_dataset(board[valid_move.active_piece_pos_y][valid_move.active_piece_pos_x],"y",empty_space_y);

        Set_element_dataset(board[empty_space_y][empty_space_x],"x",valid_move.active_piece_pos_x);
        Set_element_dataset(board[empty_space_y][empty_space_x],"y",valid_move.active_piece_pos_y);
        
        var aux = board[valid_move.active_piece_pos_y][valid_move.active_piece_pos_x];

        board[valid_move.active_piece_pos_y][valid_move.active_piece_pos_x] = board[empty_space_y][empty_space_x];
      
        board[empty_space_y][empty_space_x] = aux;
        
        console.log("*******************");
        console.log(board); 
        console.log("*******************");
        
        Set_active_pieces();

        
        empty_space_y =  valid_move.active_piece_pos_y;
        empty_space_x =  valid_move.active_piece_pos_x;
        
        
        */



        /*
        var tag_empty_space_pos_y = +Get_element_dataset(tag_empty_space,"pos_y");
        var tag_empty_space_pos_x = +Get_element_dataset(tag_empty_space,"pos_x");

        var tag_empty_space_movement_y = (tag_piece_movement_y) ?  tag_piece_movement_y * -1 : tag_piece_movement_y;
        var tag_empty_space_movement_x = (tag_piece_movement_x) ?  tag_piece_movement_x * -1 : tag_piece_movement_x;
        */

        // tag_empty_space.style.transform = "translate(" +  tag_empty_space_movement_x + "px," + tag_empty_space_movement_y + "px)"; 

        // ---------------------------------------------------------------------------------------------------------------------------
         
        /*
        Set_element_dataset(tag_piece,"pos_x",tag_empty_space_pos_x);
        Set_element_dataset(tag_piece,"pos_y",tag_empty_space_pos_y);

        Set_element_dataset(tag_empty_space,"pos_x",tag_piece_pos_x);
        Set_element_dataset(tag_empty_space,"pos_y",tag_piece_pos_y);

        */
        
        // ---------------------------------------------------------------------------------------------------------------------------     

        // var piece_aux = board[tag_empty_space_pos_y][tag_empty_space_pos_x];

        // board[tag_empty_space_pos_y][tag_empty_space_pos_x] = tag_piece;   
        // board[tag_piece_pos_y][tag_piece_pos_x] = tag_empty_space;

        // ---------------------------------------------------------------------------------------------------------------------------

             /*

        if((empty_space_position + 8) <= board.length)
        {   
            var active_piece_position = +Get_element_dataset(Pick_piece_by_class(`${empty_space_position + 8}`),position);
            
            Add_class(board[active_piece_position],"active");
            
            Set_element_dataset(board[empty_space_y][empty_space_x + 1],"movement_y",0);
            Set_element_dataset(board[empty_space_y][empty_space_x + 1],"movement_x",-100);

            board[empty_space_y][empty_space_x + 1].addEventListener("click",Move_pieces);
        }
     
         
        if(empty_space_x)
        {
            Add_class(board[empty_space_y][empty_space_x - 1],"active");
            
            Set_element_dataset(board[empty_space_y][empty_space_x - 1],"movement_y",0);
            Set_element_dataset(board[empty_space_y][empty_space_x - 1],"movement_x",100);

            board[empty_space_y][empty_space_x - 1].addEventListener("click",Move_pieces);
        }

                        
        if(empty_space_y < (board.length - 1))
        {
            Add_class(board[empty_space_y + 1][empty_space_x],"active");
            
            Set_element_dataset(board[empty_space_y + 1][empty_space_x],"movement_y",-100);
            Set_element_dataset(board[empty_space_y + 1][empty_space_x],"movement_x",0);

            board[empty_space_y + 1][empty_space_x].addEventListener("click",Move_pieces);
        }

        if(empty_space_y)
        {
            Add_class(board[empty_space_y - 1][empty_space_x],"active");
            
            Set_element_dataset(board[empty_space_y - 1][empty_space_x],"movement_y",100);
            Set_element_dataset(board[empty_space_y - 1][empty_space_x],"movement_x",0);

            board[empty_space_y - 1][empty_space_x].addEventListener("click",Move_pieces);
        } 
        
     
     
*/