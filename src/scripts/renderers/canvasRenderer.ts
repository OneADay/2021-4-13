import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

let tl;

const srandom = seedrandom('b');

export default class CanvasRenderer implements BaseRenderer{

    colors = ['#A66FA2', '#3F2D40', '#F2C335', '#BF372A', '#A66FA2'];
    backgroundColor = '#F2B9B3';
    items: any = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSize = 10;
    completeCallback: any;
    delta = 0;
    color = this.colors[0];

    constructor(canvas: HTMLCanvasElement) {
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        /// add items

        for (let i = 0; i < 100; i++) {
            let x = srandom() * WIDTH;
            let y = srandom() * HEIGHT;
            this.items.push({pos: {x, y}, color: this.colors[Math.floor(srandom() * this.colors.length - 1)]});
        }

        /// end add items

        this.reset();
        this.createTimeline();
    }

    private reset() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    public render() {
        this.delta ++;

        for (let i = this.items.length - 1; i > -1; i--) {
            this.ctx.beginPath();

            let item = this.items[i];
            let x = item.pos.x;
            let y = item.pos.y;
            this.ctx.fillStyle = item.color;

            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
    
        }

    }

    private createTimeline() {
        
        tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            onComplete: () => this.handleComplete(),
            onRepeat: () => this.handleRepeat()
        });

        //tl.timeScale(2);

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                
                tl.to(item.pos, {
                    x: srandom() * WIDTH,
                    y: srandom() * HEIGHT,
                    duration: 1,
                    ease: 'none'
                }, j);
                
                tl.to(item, {
                    color: this.colors[Math.floor(srandom() * this.colors.length - 1)],
                    duration: 1,
                    ease: 'none'
                }, j);

                /*
                tl.to(this, {
                    color: this.colors[j + 1],
                    duration: 1,
                    ease: 'none'
                }, j);
                */
            }
        }

        console.log('DURATION:', tl.duration());
        
    }

    protected handleRepeat() {
        this.reset();

        if (this.completeCallback) {
            this.completeCallback();
        }
    }

    protected handleComplete() {

    }

    public play() {
        this.reset();
        tl.restart();
    }

    public stop() {
        this.reset();
        tl.pause(true);
        tl.time(0);
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    randomX(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }

    randomY(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }
}