import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg p-2">
      <div className="flex gap-2 border-b pb-2 mb-2">
        {/* <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded"
        >
          B
        </button> */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className="px-2 py-1 border rounded"
        >
          B
        </button>




        {/* <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded"
        >
          I
        </button> */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className="px-2 py-1 border rounded"
        >
          I
        </button>


        {/* <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 border rounded"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-2 py-1 border rounded"
        >
          1. List
        </button> */}


        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className="px-2 py-1 border rounded"
        >
          • List
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className="px-2 py-1 border rounded"
        >
          1. List
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[150px] p-2" />
    </div>
  );
}
