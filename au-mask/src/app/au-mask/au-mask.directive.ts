import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

import * as includes from 'lodash.includes';
import {SPECIAL_CHARACTERS} from "./mask.utils";

@Directive({
    selector: '[au-mask]'
})
export class AuMaskDirective implements OnInit {

    @Input('au-mask')
    mask = '';

    input: HTMLInputElement;

    constructor(el: ElementRef) {

        this.input = el.nativeElement;

    }

    ngOnInit() {

        this.input.value = this.buildPlaceHolder();

    }

    @HostListener("keydown", ['$event', '$event.keyCode'])
    onKeyDown($event: KeyboardEvent, keyCode) {

        $event.preventDefault();

    }

    buildPlaceHolder(): string {

        const chars = this.mask.split('');

        return chars.reduce((result, char) => {

            return result +=
                includes(SPECIAL_CHARACTERS, char) ? char : '_'

        } , '' );


    }

}








