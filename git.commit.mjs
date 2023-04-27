/*
 * @Author: WangNing
 * @Date: 2023-02-02 10:28:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-03-13 20:42:56
 * @FilePath: /hz-map-tools/git.commit.mjs
 */
import { execSync } from 'child_process'
import fs from 'fs'
import chalk from 'chalk'

const commitId = execSync('git log -n1 --format=format:"%H"').toString()
const commitTime = execSync('git log -n1 --pretty=format:"%ad" --date=iso').toString().substring(0, 19)

const content = { commitId, commitTime }
fs.writeFileSync('./public/build.txt', JSON.stringify(content))

console.log(chalk.bgYellowBright.bold('========== 保存 git 信息成功. =========='))
