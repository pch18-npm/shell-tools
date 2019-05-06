import shell from '../main/app'





const selections = {
    apple: '苹果',
    bananaer: '香蕉',
    cat: '猫咪',
    dog: '小狗狗',
    earth: '地球',
    father: '父上大人',
    girl: '小女孩儿',
};

(async () => {

    console.log(await shell.spawn('curl baidu.com', true))

    console.log(await shell.spawnString('curl baidu.com'))

    console.log(await shell.spawnMessage('curl baidu.com', '访问百度网址'))

    console.log(await shell.spawnMessage('curl baidu.com1', '访问错误网址'))

    console.log(await shell.askCheckBox(
        '多选框请选择',
        selections,
        ['dog', 'cat']
    ))
    console.log(await shell.askList(
        '单选框请选择',
        selections,
        'girl'
    ))
    console.log(await shell.askConfirm(
        '您是漂亮小姐姐对吗?',
        false
    ))
    console.log(await shell.askInput(
        '你叫什么?',
        '小美丽',
        /^.{2,3}$/,
        '你的名字应该只有2-3个字吧'
    ))
    console.log(await shell.askNumber(
        '你多大了?',
        100,
        t => t < 80 && t > 10,
        '你的年龄太吓人了'
    ))
    console.log(await shell.askPassword(
        '能告诉我一个秘密吗?',
        '你的脸上有个bug',
        t => t.length > 5 || '太短了这能算秘密吗?',
        '我好想一点作用都没用'
    ))
})()
