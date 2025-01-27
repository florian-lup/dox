import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { useTextmenuCommands } from './hooks/useTextmenuCommands'
import { useTextmenuStates } from './hooks/useTextmenuStates'
import { BubbleMenu, Editor } from '@tiptap/react'
import { memo } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Surface } from '@/components/ui/Surface'
import { ColorPicker } from '@/components/panels'
import { FontFamilyPicker } from './components/FontFamilyPicker'
import { FontSizePicker } from './components/FontSizePicker'
import { useTextmenuContentTypes } from './hooks/useTextmenuContentTypes'
import { ContentTypePicker } from './components/ContentTypePicker'
import { EditLinkPopover } from './components/EditLinkPopover'
import { ScopeButton } from './components/ScopeButton'

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(Toolbar.Button)
const MemoColorPicker = memo(ColorPicker)
const MemoFontFamilyPicker = memo(FontFamilyPicker)
const MemoFontSizePicker = memo(FontSizePicker)
const MemoContentTypePicker = memo(ContentTypePicker)

export type TextMenuProps = {
  editor: Editor
  onDrawerOpenChange: (isOpen: boolean) => void
}

export const TextMenu = ({ editor, onDrawerOpenChange }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)

  return (
    <BubbleMenu
      tippyOptions={{
        popperOptions: {
          placement: 'top-start',
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8,
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
              },
            },
          ],
        },
        maxWidth: '100vw',
      }}
      className="max-w-[95vw] sm:max-w-none w-auto"
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <Toolbar.Wrapper className="flex flex-wrap gap-0.5">
        <ScopeButton editor={editor} onDrawerOpenChange={onDrawerOpenChange} />
        <Toolbar.Divider />
        <MemoContentTypePicker options={blockOptions} />
        <MemoFontFamilyPicker onChange={commands.onSetFont} value={states.currentFont || ''} />
        <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize || ''} />
        <Toolbar.Divider />
        <MemoButton tooltip="Bold" tooltipShortcut={['Mod', 'B']} onClick={commands.onBold} active={states.isBold}>
          <Icon name="Bold" />
        </MemoButton>
        <MemoButton
          tooltip="Italic"
          tooltipShortcut={['Mod', 'I']}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon name="Italic" />
        </MemoButton>
        <MemoButton
          tooltip="Underline"
          tooltipShortcut={['Mod', 'U']}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon name="Underline" />
        </MemoButton>
        <MemoButton
          tooltip="Strikehrough"
          tooltipShortcut={['Mod', 'Shift', 'S']}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon name="Strikethrough" />
        </MemoButton>
        <MemoButton tooltip="Code" tooltipShortcut={['Mod', 'E']} onClick={commands.onCode} active={states.isCode}>
          <Icon name="Code" />
        </MemoButton>
        <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
          <Icon name="FileCode" />
        </MemoButton>
        <EditLinkPopover onSetLink={commands.onLink} />
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentHighlight} tooltip="Highlight text">
              <Icon name="Highlighter" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentHighlight}
                onChange={commands.onChangeHighlight}
                onClear={commands.onClearHighlight}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentColor} tooltip="Text color">
              <Icon name="Palette" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentColor}
                onChange={commands.onChangeColor}
                onClear={commands.onClearColor}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton tooltip="More options">
              <Icon name="EllipsisVertical" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" asChild>
            <Surface className="min-w-[15rem] p-2">
              <Toolbar.Wrapper>
                <MemoButton
                  tooltip="Align left"
                  tooltipShortcut={['Shift', 'Mod', 'L']}
                  onClick={commands.onAlignLeft}
                  active={states.isAlignLeft}
                >
                  <Icon name="AlignLeft" />
                </MemoButton>
                <MemoButton
                  tooltip="Align center"
                  tooltipShortcut={['Shift', 'Mod', 'E']}
                  onClick={commands.onAlignCenter}
                  active={states.isAlignCenter}
                >
                  <Icon name="AlignCenter" />
                </MemoButton>
                <MemoButton
                  tooltip="Align right"
                  tooltipShortcut={['Shift', 'Mod', 'R']}
                  onClick={commands.onAlignRight}
                  active={states.isAlignRight}
                >
                  <Icon name="AlignRight" />
                </MemoButton>
                <MemoButton
                  tooltip="Justify"
                  tooltipShortcut={['Shift', 'Mod', 'J']}
                  onClick={commands.onAlignJustify}
                  active={states.isAlignJustify}
                >
                  <Icon name="AlignJustify" />
                </MemoButton>
              </Toolbar.Wrapper>
            </Surface>
          </Popover.Content>
        </Popover.Root>
      </Toolbar.Wrapper>
    </BubbleMenu>
  )
}
