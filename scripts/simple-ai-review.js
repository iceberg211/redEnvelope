#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Polyfill fetch for Node.js < 18
if (!globalThis.fetch) {
  try {
    const { fetch } = require('node-fetch');
    globalThis.fetch = fetch;
  } catch (e) {
    console.error('❌ fetch不可用，请安装node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

const API_ENDPOINT = 'https://weihe.life/aichat/graphql';

// 支持通过环境变量选择模型
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'; // 或 'deepseek-reasoner'

async function reviewCode(code, filename = '') {
  const language = getLanguage(filename);

  const mutation = `
    mutation($input: CodeReviewInput!) {
      codeReview(input: $input) {
        summary
        score
        issues {
          severity
          title
          description
          suggestion
          location {
            path
            lineStart
            lineEnd
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      provider: "DEEPSEEK",
      model: MODEL,
      filename: filename,
      language: language,
      goals: ["Correctness", "Security", "Readability"],
      code: code,
      temperature: 0,
      guidelines: "Focus on Web3 security and TypeScript best practices"
    }
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation, variables })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data.codeReview;
  } catch (error) {
    console.error(`❌ AI审查失败: ${error.message}`);
    return null;
  }
}

function getLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.sol': 'solidity',
    '.json': 'json'
  };
  return map[ext] || 'text';
}

function getChangedFiles() {
  try {
    let output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    if (!output.trim()) {
      output = execSync('git diff --name-only origin/main...HEAD', { encoding: 'utf8' });
    }
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch (error) {
    console.error('获取变更文件失败:', error.message);
    return [];
  }
}

function shouldReview(filepath) {
  const ignore = ['node_modules', 'dist', 'build', '.min.js', 'package-lock.json', 'pnpm-lock.yaml'];
  return !ignore.some(pattern => filepath.includes(pattern));
}

async function main() {
  console.log(`🤖 开始AI代码审查... (使用模型: ${MODEL})`);

  const files = getChangedFiles().filter(shouldReview);

  if (files.length === 0) {
    console.log('✅ 没有需要审查的文件');
    return;
  }

  console.log(`📁 审查 ${files.length} 个文件:`);

  let totalIssues = 0;
  let hasErrors = false;

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    console.log(`\n🔍 ${file}`);
    const code = fs.readFileSync(file, 'utf8');

    if (code.trim().length === 0) continue;

    const review = await reviewCode(code, file);

    if (review) {
      const { summary, score, issues = [] } = review;

      if (score) console.log(`   评分: ${score}/100`);
      if (summary) console.log(`   ${summary}`);

      if (issues.length > 0) {
        totalIssues += issues.length;
        console.log(`   发现 ${issues.length} 个问题:`);

        issues.forEach((issue, i) => {
          const icon = issue.severity === 'ERROR' ? '❌' : issue.severity === 'WARN' ? '⚠️' : 'ℹ️';
          console.log(`     ${i+1}. ${icon} ${issue.title}`);
          if (issue.description) console.log(`        ${issue.description}`);
          if (issue.suggestion) console.log(`        💡 ${issue.suggestion}`);

          // 显示位置信息
          if (issue.location && issue.location.lineStart) {
            const lineInfo = issue.location.lineEnd && issue.location.lineEnd !== issue.location.lineStart
              ? `第${issue.location.lineStart}-${issue.location.lineEnd}行`
              : `第${issue.location.lineStart}行`;
            console.log(`        📍 位置: ${lineInfo}`);
          }

          if (issue.severity === 'ERROR') hasErrors = true;
        });
      } else {
        console.log('   ✅ 未发现问题');
      }
    }
  }

  console.log(`\n📊 审查完成 - 共发现 ${totalIssues} 个问题`);
  if (hasErrors) {
    console.log('❌ 发现严重问题');
    process.exit(1);
  } else if (totalIssues > 0) {
    console.log('⚠️ 发现一些改进建议');
  } else {
    console.log('✅ 代码质量良好');
  }
}

if (require.main === module) {
  main();
}