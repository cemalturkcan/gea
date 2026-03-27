/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-object-type */
import type { JSX as ReactJSX, DOMAttributes, ReactEventHandler } from 'react'

type _GeaDomAugment<T> = DOMAttributes<T>

declare module 'react' {
  interface LabelHTMLAttributes<T> {
    for?: string | undefined
  }
  interface DOMAttributes<T> {
    class?: string | undefined
    click?: _GeaDomAugment<T>['onClick']
    dblclick?: _GeaDomAugment<T>['onDoubleClick']
    change?: _GeaDomAugment<T>['onChange']
    input?: _GeaDomAugment<T>['onInput']
    submit?: _GeaDomAugment<T>['onSubmit']
    reset?: _GeaDomAugment<T>['onReset']
    focus?: _GeaDomAugment<T>['onFocus']
    blur?: _GeaDomAugment<T>['onBlur']
    keydown?: _GeaDomAugment<T>['onKeyDown']
    keyup?: _GeaDomAugment<T>['onKeyUp']
    keypress?: _GeaDomAugment<T>['onKeyPress']
    mousedown?: _GeaDomAugment<T>['onMouseDown']
    mouseup?: _GeaDomAugment<T>['onMouseUp']
    mouseover?: _GeaDomAugment<T>['onMouseOver']
    mouseout?: _GeaDomAugment<T>['onMouseOut']
    mouseenter?: _GeaDomAugment<T>['onMouseEnter']
    mouseleave?: _GeaDomAugment<T>['onMouseLeave']
    touchstart?: _GeaDomAugment<T>['onTouchStart']
    touchend?: _GeaDomAugment<T>['onTouchEnd']
    touchmove?: _GeaDomAugment<T>['onTouchMove']
    pointerdown?: _GeaDomAugment<T>['onPointerDown']
    pointerup?: _GeaDomAugment<T>['onPointerUp']
    pointermove?: _GeaDomAugment<T>['onPointerMove']
    scroll?: _GeaDomAugment<T>['onScroll']
    resize?: ReactEventHandler<T> | undefined
    drag?: _GeaDomAugment<T>['onDrag']
    dragstart?: _GeaDomAugment<T>['onDragStart']
    dragend?: _GeaDomAugment<T>['onDragEnd']
    dragover?: _GeaDomAugment<T>['onDragOver']
    dragleave?: _GeaDomAugment<T>['onDragLeave']
    drop?: _GeaDomAugment<T>['onDrop']
    tap?: (e: Event) => void
    longTap?: (e: Event) => void
    swipeRight?: (e: Event) => void
    swipeUp?: (e: Event) => void
    swipeLeft?: (e: Event) => void
    swipeDown?: (e: Event) => void
  }
}

export declare namespace JSX {
  export type Element = string
  export interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  export interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
  export interface ElementAttributesProperty {
    props: {}
  }
  export interface ElementChildrenAttribute {
    children: {}
  }
  export interface ElementClass {
    template?(props: unknown): unknown
  }
  export type ElementType =
    | keyof IntrinsicElements
    | ((props: any) => any)
    | (new (props?: any, ...args: any[]) => ElementClass)
}

export declare function jsx(): JSX.Element
export declare function jsxs(): JSX.Element
export declare const Fragment: unique symbol
