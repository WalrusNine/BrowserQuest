import Entity from "./entity";
import Types from "@common/gametypes";

interface HandleDespawnParams {
    beforeBlinkDelay: number;
    blinkCallback: () => void;
    blinkingDuration: number;
    despawnCallback: () => void;
}

export default class Item extends Entity {

    isStatic : boolean;
    isFromChest : boolean;

    respawn_callback : () => void;

    blinkTimeout : NodeJS.Timer;
    despawnTimeout : NodeJS.Timer;

    constructor (id : string, kind : Types.Entities, x : number, y : number) {
        super(id, "item", kind, x, y);
        this.isStatic = false;
        this.isFromChest = false;
    }
    
    handleDespawn (params : HandleDespawnParams) : void {
        let self = this;
        this.blinkTimeout = setTimeout(function() {
            params.blinkCallback();
            self.despawnTimeout = setTimeout(params.despawnCallback, params.blinkingDuration);
        }, params.beforeBlinkDelay);
    }
    
    destroy () : void {
        if (this.blinkTimeout) {
            clearTimeout(this.blinkTimeout);
        }
        if (this.despawnTimeout) {
            clearTimeout(this.despawnTimeout);
        }
        
        if (this.isStatic) {
            this.scheduleRespawn(30000);
        }
    }
    
    scheduleRespawn (delay : number) : void {
        let self = this;
        setTimeout(function() {
            if (self.respawn_callback) {
                self.respawn_callback();
            }
        }, delay);
    }
    
    onRespawn (callback : () => void) : void {
        this.respawn_callback = callback;
    }
}