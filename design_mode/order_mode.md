# 命令模式

1️⃣ 需要将命令封装起来，将命令对应的操作封装在命令对象中，以延长命令的生命周期，等待需要的时候再去被调用
2️⃣ 命令的发出者，命令的执行者，两者并不需要知道对方的内部构造，也不需要知道命令的执行过程是怎么样的

###  为何要封装命令
1️⃣ 使用闭包封装命令可以最大成都还原命令执行当时的状态
2️⃣ 便于收集命令以进行其他操作，比如延迟执行、命令重放、命令撤销等                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  