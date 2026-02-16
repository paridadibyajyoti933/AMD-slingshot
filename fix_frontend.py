import re

# Read the file
with open(r"c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os\frontend\src\pages\ResearchCopilot.jsx", 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the alert line
old_pattern = r"alert\(`✅ Paper uploaded successfully!\\\\n\\\\nTitle: \$\{data\.title\}\\\\nPaper ID: \$\{data\.paper_id\}\\\\nStatus: \$\{data\.status\}`\);"

new_code = """let message = `✅ Paper uploaded successfully!\\n\\nTitle: ${data.title}\\nPaper ID: ${data.paper_id}\\nStatus: ${data.status}`;
                
                if (data.text_length) {
                    message += `\\nText extracted: ${data.text_length} characters`;
                }
                
                if (data.preview) {
                    message += `\\n\\n📄 Text Preview:\\n${data.preview}`;
                }
                
                if (data.summary) {
                    message += `\\n\\n📝 AI Summary:\\n${data.summary}`;
                }
                
                if (data.key_contributions) {
                    message += `\\n\\n🎯 Key Contributions:\\n${data.key_contributions}`;
                }
                
                if (data.note) {
                    message += `\\n\\n⚠️ ${data.note}`;
                }
                
                alert(message);"""

content = re.sub(old_pattern, new_code, content)

# Write back
with open(r"c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os\frontend\src\pages\ResearchCopilot.jsx", 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ File updated successfully!")
