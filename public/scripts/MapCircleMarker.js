class MapCircleMarker{

    constructor (color){
        this._color = color;
        this._fillcolor = '#fo3';
        this._fillOpacity = 0.5;
        this._radius = 20;
    }

    // GETTERS
    get color(){
        return this._color;
    }

    get fillcolor(){
        return this._fillcolor;
    }

    get fillOpacity(){
        return this._fillOpacity;
    }

    get radius(){
        return this._radius;
    }

    // SETTERS
    set color(newColor){
        this._color = newColor;
    }

    set fillcolor(newFillcolor){
        this._fillcolor = newFillcolor;
    }

    set fillOpacity(newFillOpacity){
        this._fillOpacity = newFillOpacity;
    }

    set radius(newRadius){
        this._radius = newRadius;
    }

}