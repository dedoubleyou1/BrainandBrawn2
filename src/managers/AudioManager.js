/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   _             _ _                                                  
  /_\  _   _  __| (_) ___     /\/\   __ _ _ __   __ _  __ _  ___ _ __ 
 //_\\| | | |/ _` | |/ _ \   /    \ / _` | '_ \ / _` |/ _` |/ _ \ '__|
/  _  \ |_| | (_| | | (_) | / /\/\ \ (_| | | | | (_| | (_| |  __/ |   
\_/ \_/\__,_|\__,_|_|\___/  \/    \/\__,_|_| |_|\__,_|\__, |\___|_|   
                                                      |___/            

Summary: Handles audio in the game 

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

//TEMP - global function
function playSound(snd)
{
	var sound = game.add.audio(snd);
  sound.play();
}
