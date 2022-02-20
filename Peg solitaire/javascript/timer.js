
class Timer
{

   // =====================================================  

    constructor()
    {
        /*
        this.status = 1;
        this.current_time = new Date();
        */
        // this.start_time = this.current_time;
        
        
        
        // this.update_passed_time();

        /*
           STATUS
           
           0 - paused
           1 - running 
               
        */
                 
    }

    // =====================================================

    set current_time(current_time)
    {
        this._current_time = current_time;  
    }

    get current_time()
    {
        return this._current_time;  
    }

    // =====================================================

    set status(status)
    {
        this._status = status;  
    }

    get status()
    {
        return this._status;  
    }

    // =====================================================

    set passed_time(passed_time)
    {
        this._passed_time = passed_time;  
    }

    get passed_time()
    {
        return this._passed_time;  
    }

    // =====================================================

    set counter(callback_function)
    {
        this._counter = callback_function; 
    }
   
    get counter()
    {
        return this._counter;
    }

    // =====================================================
    
    update_passed_time()
    {
        this.current_time = new Date();
        this.passed_time = this.current_time - this.start_time;
    }

    // =====================================================

    format_milliseconds(milliseconds)
    {
   
        var hours = (milliseconds - (milliseconds % 3600000)) / 3600000;

        milliseconds -= hours * 3600000;

        var minutes = (milliseconds - (milliseconds % 60000)) / 60000;

        milliseconds -= minutes * 60000;

        var seconds = (milliseconds - (milliseconds % 1000)) / 1000;
          
       return this.add_zero([hours,minutes,seconds]);
    }

    // =====================================================
        
    add_zero(numbers)
    {
        return numbers.map(number => (number < 10) ? `0${number}`: number);
    }

    // =====================================================

    pause_timer()
    {
        this.clear_timer_counter();
    }

    // ======================================================

    resume_timer(callback_function)
    {       

        this.current_time = new Date();
        this.start_time = this.current_time;
                                        
        this.start_time = this.start_time.setMilliseconds(this.start_time.getMilliseconds() - this.passed_time); 

        this.set_timer_counter(callback_function);

    }

    // ======================================================

    set_timer_counter(callback_function)
    {
        this.counter = window.setInterval(callback_function,1000); 
    }

    // ======================================================

    clear_timer_counter()
    {
        window.clearInterval(this.counter);
        this.counter = null;
    }

    // =====================================================

}