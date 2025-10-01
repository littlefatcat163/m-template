import * as vscode from "vscode";
import path from "path";

export function activate(context) {
  // 监听文件创建事件
  const disposable = vscode.workspace.onDidCreateFiles(async (event) => {
    for (const file of event.files) {
      if (file.fsPath.endsWith(".md")) {
        try {
          const uri = file;

          const doc = await vscode.workspace.openTextDocument(uri);
          const edit = new vscode.WorkspaceEdit();

          const frontMatter = [
            `---`,
            `title: ${path.parse(uri.path).name}`,
            "description: ",
            `datetime: ${Date.now()}`,
            "categories:",
            "tags:",
            "---\n\n",
          ].join("\n");

          edit.insert(uri, new vscode.Position(0, 0), frontMatter);

          await vscode.workspace.applyEdit(edit);
          await doc.save();
          console.log(`Front Matter 已插入到 ${uri.fsPath}`);
        } catch (err) {
          console.error("插入 Front Matter 失败", err);
        }
      }
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
