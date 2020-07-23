/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

const { CursorTracker, IdleMonitor } = imports.gi.Meta;

const ExtensionUtils = imports.misc.extensionUtils;

const HIDE_TIME_KEY = 'hide-time';

class Extension {
    enable() {
        this._settings = ExtensionUtils.getSettings();

        this._settings_connection = this._settings.connect(`changed::${HIDE_TIME_KEY}`, this._hideTimeChanged.bind(this));

        this._cursorTracker = CursorTracker.get_for_display(global.display);
        this._idleMonitor = IdleMonitor.get_core();

        this._addIdleWatch(this._settings.get_double(HIDE_TIME_KEY));
    }

    disable() {
        this._removeIdleWatch();

        if (this._settings_connection) {
            this._settings.disconnect(this._settings_connection);
            this._settings_connection = null;
        }

    }

    _hideTimeChanged() {
        this._addIdleWatch(this._settings.get_double(HIDE_TIME_KEY));
    }

    _addIdleWatch(idleTime) {
        this._removeIdleWatch();

        this._idle_watch = this._idleMonitor.add_idle_watch(idleTime * 1000, this._onIdle.bind(this));
    }

    _removeIdleWatch() {
        if (this._idle_watch) {
            this._idleMonitor.remove_watch(this._idle_watch);
            this._idle_watch = null;
        }

        if (this._active_watch) {
            this._idleMonitor.remove_watch(this._active_watch);
            this._active_watch = null;
        }
    }

    _onIdle() {
        this._cursorTracker.set_pointer_visible(false);

        this._active_watch = this._idleMonitor.add_user_active_watch(this._onActive.bind(this));
    }

    _onActive() {
        this._cursorTracker.set_pointer_visible(true);
    }
}

/* exported init */
function init() {
    return new Extension();
}
