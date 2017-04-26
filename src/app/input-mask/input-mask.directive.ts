import {Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, SimpleChanges} from "@angular/core";
import {setInputCursorPosition} from "./setInputCursorPosition";

import * as findLastIndex from 'lodash.findlastindex';


@Directive({
  selector: 'input[au-mask]'
})
export class InputMask implements OnChanges {

  @Input('au-mask')
  mask = '';

  currentValue = '';

  input: HTMLInputElement;

  constructor( el:ElementRef) {
    this.input = el.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mask']) {
      this.currentValue = applyMask(this.mask);
    }

  }

  @HostBinding('value')
  get value() {
    return this.currentValue;
  }

  @HostListener("keydown", ['$event','$event.key', '$event.keyCode'])
  onKeyDown($event: KeyboardEvent, key, keyCode) {

    $event.preventDefault();

    const cursorPos = this.input.selectionStart;

    if (KEY_ACTIONS[keyCode]) {
      KEY_ACTIONS[keyCode](this.input, cursorPos, this.mask, key, keyCode);
    }

  }

}

type KeyAction = (input: HTMLInputElement, position:number, mask?:string, key?:string, keyCode?:number) => void


const handleRightArrow:KeyAction = (input, position) => {

  const value = input.value;

  const nextNonSpaceOffset = value.slice(position + 1).search(/[^\s]{1}/);

  setInputCursorPosition(input, position + 1 + nextNonSpaceOffset);
};



function handleLeftArrow(input, position) {

  const value = input.value;

  const previousNonSpacePosition = findLastIndex(value.slice(0, position), char => char !== ' ' );

  setInputCursorPosition(input, previousNonSpacePosition);

}



const handleNumeric:KeyAction = (input,  position, mask, key, keyCode) => {

  if ( keyCode < 48 || keyCode > 57 ) {
    return;
  }

  const currentValue = input.value;

  input.value = currentValue.slice(0, position) + key + currentValue.slice(position + 1);

  handleRightArrow(input, position);
};




const LEFT_ARROW =	37, UP_ARROW = 38, RIGHT_ARROW = 39, DOWN_ARROW = 40;

const KEY_ACTIONS: {[key:number]: KeyAction} = {};

KEY_ACTIONS[RIGHT_ARROW] = handleRightArrow;
KEY_ACTIONS[LEFT_ARROW] = handleLeftArrow;

for (let i = 48; i <= 57; i++) {
  KEY_ACTIONS[i] = handleNumeric;
}




const SPECIAL_CHARS_REGEX = {
  ' ': {
    regex: /[\s]{1}/,
    replaceWith: '  '
  },
  '-': {
    regex: /[-]{1}/,
    replaceWith: '-'
  }
};

// 9, a, A, *




function applyMask(input:string) {

  const chars = input.split('');

  const value = chars.reduce((result, char) =>  {

    return result += SPECIAL_CHARS_REGEX[char] ? SPECIAL_CHARS_REGEX[char].replaceWith : '_';

  },'');

  return '  ' + value;
}
