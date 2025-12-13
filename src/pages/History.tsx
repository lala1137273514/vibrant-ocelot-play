import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, History as HistoryIcon, PenLine, Trash2 } from "lucide-react";
import { TimerMode } from "@/components/ModeSelector";
import { loadHistory, saveHistory, TimerHistoryEntry } from "@/utils/historyStorage";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const modeCopy: Record<TimerMode, string> = {
  work: "工作",
  shortBreak: "短休息",
  longBreak: "长休息",
};

const History = () => {
  const [history, setHistory] = useState<TimerHistoryEntry[]>([]);
  const [form, setForm] = useState({
    title: "",
    mode: "work" as TimerMode,
    durationMinutes: 25,
    notes: "",
  });
  const [editing, setEditing] = useState<TimerHistoryEntry | null>(null);

  useEffect(() => {
    const stored = loadHistory();
    if (stored.length) {
      setHistory(stored);
      return;
    }

    const seedEntry: TimerHistoryEntry = {
      id: crypto.randomUUID(),
      title: "示例：专注写作",
      mode: "work",
      durationMinutes: 50,
      createdAt: new Date().toISOString(),
      notes: "双倍番茄用于写文章开头和结构。",
    };
    setHistory([seedEntry]);
  }, []);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const totalMinutes = useMemo(
    () => history.reduce((sum, entry) => sum + entry.durationMinutes, 0),
    [history]
  );

  const handleCreate = () => {
    if (!form.title.trim()) return;

    const newEntry: TimerHistoryEntry = {
      id: crypto.randomUUID(),
      title: form.title,
      mode: form.mode,
      durationMinutes: form.durationMinutes,
      notes: form.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => [newEntry, ...prev]);
    setForm({ ...form, title: "", notes: "" });
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleUpdate = () => {
    if (!editing) return;

    setHistory((prev) =>
      prev.map((entry) => (entry.id === editing.id ? editing : entry))
    );
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">番茄钟历史</p>
            <h1 className="text-3xl font-bold text-slate-900">记录你的专注旅程</h1>
            <p className="text-slate-600 mt-1">查看、编辑与整理曾经的番茄钟，帮助你复盘与改进。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">返回计时器</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">新增历史记录</CardTitle>
                <CardDescription>把刚完成的番茄钟记录下来，方便日后查看。</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Plus className="h-4 w-4" />
                新增
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="title">事项名称</Label>
                <Input
                  id="title"
                  placeholder="例如：阅读 25 分钟"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label>类型</Label>
                  <Select
                    value={form.mode}
                    onValueChange={(value) => setForm({ ...form, mode: value as TimerMode })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">专注</SelectItem>
                      <SelectItem value="shortBreak">短休息</SelectItem>
                      <SelectItem value="longBreak">长休息</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="duration">时长（分钟）</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm({ ...form, durationMinutes: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  placeholder="补充完成情况、状态或下一步想法"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <Button className="w-full" onClick={handleCreate} disabled={!form.title.trim()}>
                保存到历史
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-indigo-600" />
                数据概览
              </CardTitle>
              <CardDescription>总览已记录的番茄钟，帮助你回顾投入时间。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-sm text-slate-500">累计记录</p>
                  <p className="text-3xl font-semibold text-slate-900">{history.length}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-sm text-slate-500">累计分钟</p>
                  <p className="text-3xl font-semibold text-slate-900">{totalMinutes}</p>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-slate-500">小技巧：保持每周复盘，挑选两条记录进行优化。</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle>历史记录</CardTitle>
            <CardDescription>在这里查看、编辑或删除番茄钟记录。</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                还没有历史记录，先去完成一个番茄钟吧！
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>事项</TableHead>
                      <TableHead className="hidden md:table-cell">类型</TableHead>
                      <TableHead>时长</TableHead>
                      <TableHead className="hidden md:table-cell">时间</TableHead>
                      <TableHead className="hidden md:table-cell">备注</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant="secondary"
                            className={cn("capitalize", {
                              "bg-emerald-50 text-emerald-700": entry.mode === "work",
                              "bg-amber-50 text-amber-700": entry.mode === "shortBreak",
                              "bg-blue-50 text-blue-700": entry.mode === "longBreak",
                            })}
                          >
                            {modeCopy[entry.mode]}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.durationMinutes} 分钟</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(entry.createdAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {entry.notes || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={editing?.id === entry.id}
                              onOpenChange={(open) => {
                                if (!open) return setEditing(null);
                                setEditing(entry);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <PenLine className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>编辑记录</DialogTitle>
                                  <DialogDescription>更新信息并保存。</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-title">事项名称</Label>
                                    <Input
                                      id="edit-title"
                                      value={editing?.title ?? ""}
                                      onChange={(e) =>
                                        setEditing((prev) =>
                                          prev && { ...prev, title: e.target.value }
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>类型</Label>
                                    <Select
                                      value={editing?.mode ?? "work"}
                                      onValueChange={(value) =>
                                        setEditing((prev) =>
                                          prev && { ...prev, mode: value as TimerMode }
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="work">专注</SelectItem>
                                        <SelectItem value="shortBreak">短休息</SelectItem>
                                        <SelectItem value="longBreak">长休息</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-duration">时长（分钟）</Label>
                                    <Input
                                      id="edit-duration"
                                      type="number"
                                      min={1}
                                      value={editing?.durationMinutes ?? 0}
                                      onChange={(e) =>
                                        setEditing((prev) =>
                                          prev && {
                                            ...prev,
                                            durationMinutes: Number(e.target.value),
                                          }
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-notes">备注</Label>
                                    <Textarea
                                      id="edit-notes"
                                      value={editing?.notes ?? ""}
                                      onChange={(e) =>
                                        setEditing((prev) =>
                                          prev && { ...prev, notes: e.target.value }
                                        )
                                      }
                                    />
                                  </div>
                                  <Button onClick={handleUpdate} disabled={!editing?.title.trim()}>
                                    保存修改
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              aria-label="删除记录"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
