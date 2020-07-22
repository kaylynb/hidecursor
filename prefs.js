/* prefs.js
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

const Gtk = imports.gi.Gtk

const ExtensionUtils = imports.misc.extensionUtils

let settings

function init () { // eslint-disable-line no-unused-vars
  settings = ExtensionUtils.getSettings()
}

function buildPrefsWidget () { // eslint-disable-line no-unused-vars
  const frame = new Gtk.VBox({ border_width: 10, spacing: 6 })

  frame.pack_start(new Gtk.Label({
    label: '<b>Timing</b>',
    use_markup: true,
    xalign: 0
  }), false, false, 0)

  const sectionVbox = new Gtk.VBox({ margin_left: 15, margin_top: 8, margin_bottom: 8 })
  const spinner = Gtk.SpinButton.new_with_range(0.0, 600.0, 0.5)
  spinner.set_value(settings.get_double('hide-time'))
  const sectionHbox = new Gtk.HBox()
  sectionHbox.pack_start(new Gtk.Label({
    label: 'Delay in seconds before hiding cursor',
    use_markup: true,
    xalign: 0
  }), true, true, 0)
  sectionHbox.pack_end(spinner, false, false, 0)

  sectionVbox.pack_start(sectionHbox, false, false, 0)

  settings.connect('changed::hide-time', (_, value) => spinner.set_value(settings.get_double(value)))
  spinner.connect('value-changed', widget => settings.set_double('hide-time', widget.get_value()))

  frame.pack_start(sectionVbox, false, false, 0)

  frame.show_all()
  return frame
}
