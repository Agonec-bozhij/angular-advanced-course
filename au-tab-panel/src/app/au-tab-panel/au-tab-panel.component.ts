import {AfterContentInit, Component, ContentChildren, OnInit, QueryList} from '@angular/core';
import {AuTabComponent} from "../au-tab/au-tab.component";

@Component({
    selector: 'au-tab-panel',
    templateUrl: './au-tab-panel.component.html',
    styleUrls: ['../tab-panel.component.scss']
})
export class AuTabPanelComponent implements AfterContentInit {


    @ContentChildren(AuTabComponent)
    tabs: QueryList<AuTabComponent>;

    constructor() {
    }

    ngAfterContentInit() {
        console.log(this.tabs);
    }

}
