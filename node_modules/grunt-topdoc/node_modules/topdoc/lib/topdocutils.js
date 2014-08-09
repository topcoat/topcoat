/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
topdocutils = {
  slugify: function(title) {
    var nonWordRegex, slug, spaceRegex;
    slug = title.toLowerCase();
    spaceRegex = /( +)/;
    slug = slug.replace(spaceRegex, "-");
    nonWordRegex = /([^\w-]+)/;
    slug = slug.replace(nonWordRegex, "");
    return slug;
  },
  titlify: function(slug) {
    var title;
    title = slug.replace(/-/g, ' ');
    if (title.indexOf('.css') === title.length - 4) {
      title = title.replace('.css', '');
    }
    title = title.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return title;
  }
}

module.exports = topdocutils;
