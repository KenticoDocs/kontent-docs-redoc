import { observer } from 'mobx-react';
import * as React from 'react';

import { IMenuItem, MenuStore } from '../../services/MenuStore';
import { OptionsContext } from '../OptionsProvider';
import { MenuItems } from './MenuItems';

import { PerfectScrollbarWrap } from '../../common-elements/perfect-scrollbar';

@observer
export class SideMenu extends React.Component<{ menu: MenuStore; className?: string; status?: string }> {
  static contextType = OptionsContext;
  private _updateScroll?: () => void;

  render() {
    const store = this.props.menu;
    const status = this.props.status;

    return (
      <PerfectScrollbarWrap
        updateFn={this.saveScrollUpdate}
        className={this.props.className}
        options={{
          wheelPropagation: false,
        }}
      >
        <MenuItems items={store.items} onActivate={this.activate} root={true} status={status} />
        <RedocAttribution>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/Redocly/redoc">
             Powered by ReDoc
          </a>
        </RedocAttribution>
      </PerfectScrollbarWrap>
    );
  }

  activate = (item: IMenuItem) => {
    if (item && item.active && this.context.menuToggle) {
      return item.expanded ? item.collapse() : item.expand();
    }

    this.props.menu.activateAndScroll(item, true);
    setTimeout(() => {
      if (this._updateScroll) {
        this._updateScroll();
      }
    });
  };

  private saveScrollUpdate = upd => {
    this._updateScroll = upd;
  };
}
