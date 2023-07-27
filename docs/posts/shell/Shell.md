# Shell基础

## 1. Hello World

第一个shell程序：创建一个 hello.sh 文件，写入以下内容：

```shell
#!/bin/bash
echo "Hello World !"
```

> 脚本以 <strong style="color:red">#!/bin/bash</strong> 开头，表示选择一个解析器。

如何运行？

```shell
# 使用 sh 或 bash 执行
sh hello.sh
bash hello.sh
```

```sh
# 为脚本文件增加权限 x（可执行权限）
chmod +x hello.sh
./hello.sh
```

## 2. 注释

以`#`开头的行就是注释，会被解释器忽略。sh里没有多行注释，只能每一行加一个#号。

```
# --------
# 这是注释块
# --------
```

## 3. 变量

### 常用系统变量

- `$HOME	`  主目录
- `$PWD` 当前工作目录
- `SHELL` 当前解析器
- `$USER` 当前用户

### 自定义变量

定义变量时，**变量名和等号之间不能有空格**，如：

```sh
variableName="value"
```

变量名的命名须遵循如下规则：

> - 首个字符必须为字母（a-z，A-Z）。

- 中间不能有空格，可以使用下划线（_）
- 不能使用标点符号
- 不能使用bash里的关键字（可用help命令查看保留关键字）

**使用变量**

使用一个定义过的变量，只要在变量名前面加美元符号（$）即可，如：

```sh
your_name="lalal"
echo $your_name
echo ${your_name}
```

**变量名外面的花括号是可选的**，加花括号是为了帮助解释器识别变量的边界，比如下面这种情况：

```sh
skill="lalal"
echo "$skillScript"   # 此时将 skillScript 识别为了变量，错误
echo "${skill}Script" # 正确
```

在变量前面加`readonly` 命令可以将变量定义为只读变量，只读变量的值不能被改变。

```bash
url="http://www.baidu.com"
readonly url
url="http://www.baidu.com"
```

使用 `unset` 命令可以删除变量。语法：

```sh
unset variable_name
```

### 特殊变量

| 变量 | 含义                                                         |
| :--: | ------------------------------------------------------------ |
| `$0` | 当前脚本的文件名                                             |
| `$n` | 传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是`$1`，第二个参数是`$2`。 |
| `$#` | 传递给脚本或函数的参数个数。                                 |
| `$*` | 传递给脚本或函数的所有参数。                                 |
| `$@` | 传递给脚本或函数的所有参数。被双引号(" ")包含时，与 `$*` 稍有不同 |
| `$?` | 上个命令的退出状态，或函数的返回值。                         |
| `$$` | 当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID。 |

`$n`示例：

```sh
#!/bin/bash
echo script name: $0
echo 1st paramater: $1
echo 2nd paramater: $2
```

输出：

![image-20230727114631922](/images/posts/article-img/image-20230727114631922.png)

## 4. 运算符

在shell中直接使用 `a=1+1`是无法将计算结果赋值给a的

![image-20230727131522703](/images/posts/article-img/image-20230727131522703.png)

这里需要使用**命令替换**，将表达式使用`$[]`包裹：

```sh
a=$[1+1]
```

**常用运算符**

- `+` 加法
- `-` 减法
- `*` 乘法
- `/` 除法	
- `%` 取余	
- `=` 赋值	
- `==` 相等。用于比较两个数字。
- `!=` 不相等。用于比较两个数字。

> <strong style="color:red">注意：在Shell中，`1`代表假,`0`代表真</strong>

**常用条件判断**

- `-eq` 等于
- `-ne` 不等于
- `-lt` 小于 

- `-le` 小于等于
- `-gt` 大于
- `-ge` 大于等于

**文件权限判断**

- `-r` 是否有可读权限
- `-w` 是否有可写权限
- `-x` 是否有可执行权限

**文件类型判断**

- `-e` 文件是否存在
- `-f` 文件存在且是一个常规文件（file）
- `-d` 文件存在并且是一个目录（directory）

```sh
[ -e file.txt ]
```

**多条件判断**

- `&&` 逻辑`与`
- `||` 逻辑`或`

## 5. 流程控制

### if 分支判断

**单分支**

```sh
if [ 条件判断 ]
then
	程序
else
	程序
fi
```

**多分枝**

```sh
if [ 条件判断 ]
then
	程序
elif [ 条件判断 ]
then
	程序
else
	程序
fi
```

### case 选择

```sh
case $变量名 in    # case行尾部必须是 in 
"值1")            # 匹配值后以 ）结束
	程序1
;;								# ;;表示程序1执行完成后跳出case选择相当于调用了break
"值2")
	程序2
;;
*)								# * 表示都不匹配的情况下执行，相当于 default
	程序3
;;
esac              # 结束
```

### for 循环

```sh
for (( 初始值;循环控制;变量变化 ))
do
	程序
done
```

示例：计算输入值的累加

```sh
#!/bin/bash
sum=0;
for (( i=0;i<=$1;i++ ))
do
sum=$[ $sum + $i ]
done
echo $sum   # 输出5050
```

**增强for**

```sh
for 变量 in 值1 值2 ....
do
	程序
done
```

示例：打印所有输入值

```sh
#!/bin/bash
for item in $1 $2 $3 $4
do
echo $item
done
```

### while 循环

```sh
while [ 条件判断 ]
do
	程序
done
```

示例：输入值的累加

```sh
#!/bin/bash
sum=0
i=0
while [ $i -le $1 ]
do
sum=$[$sum + $i]
i=$[${i} + 1] 
done
echo $sum
```

## 6. 读取用户输入

**基本语法**

```sh
read (选项)（参数）
```

选项

- -p: 指定输入取值时候的提示
- -t: 指定读取输入的最大等待时间

**示例**

```sh
#!/bin/bash
read -p "enter your name: " name
echo $name
read -p "enter your gender and age: " gender age
echo gender is $gender, age is $age
```

## 7. 函数

### 常用系统函数

#### basename

删除包括最后一个`/`前所有的路径参数，若指定后缀`suffix`则只返回脚本文件名

**语法**

```
basename [path/filename][suffix]
```

**示例**

```sh
#!/bin/bash
echo $(basename $0 .sh)   # 返回脚本文件名（不带后缀）
```

#### dirname

从给定绝对路径的文件名字符串中返回去除文件名（非目录部分），返回目录部分。

**语法**

```sh
dirname [/path/filename]     # 返回path
```



### 自定义函数

**基本语法**

```sh
[ function ] 函数名[()]      # 这里[]表示可选
{
	程序操作;
	[return int;]
}
```

示例：对输入数求和

```sh
#!/bin/bash
function add(){
    s=$[$1+$2]
    echo $s             # 此处不能使用return返回，因为return只能返回（0～255）
}
read -p "第一个数：" a
read -p "第二个数：" b

sum=$(add $a $b)       # 此处为调用函数，将函数的打印赋值给sum
echo $sum
```

