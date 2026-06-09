/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'fabric' | 'craft' | 'collection' | 'sensing';

export interface ProductColor {
  id: string;
  name: string;
  nameEn: string;
  hex: string;
  description: string;
}

export interface ProductModel {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  price: string;
  materials: {
    name: string;
    ratio: string;
    desc: string;
  }[];
  colors: ProductColor[];
  images: string[];
}

export interface SectionSpec {
  id: string;
  label: string;
  value: string;
  desc: string;
}
