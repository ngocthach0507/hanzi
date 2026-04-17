const fs = require('fs');
const path = require('path');

// Paths
const sourcePath = 'tài liệu hsk/ngữ pháp/ngữ pháp hsk2 .json';
const targetPath = 'data/grammar-hsk2.json';

try {
    // Read files
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

    console.log(`Processing HSK 2 Grammar Merge...`);
    console.log(`Target points: ${targetData.length}`);

    let updatedCount = 0;

    // Create a flat map of source points for easy lookup
    // Key: lesson_pointIndex (e.g. "1_1")
    const sourceMap = {};
    sourceData.grammar_points.forEach(lessonObj => {
        lessonObj.points.forEach((pointObj, index) => {
            const key = `${lessonObj.lesson}_${index + 1}`;
            sourceMap[key] = pointObj;
        });
    });

    // Update target data
    const updatedTargetData = targetData.map(targetPoint => {
        const key = `${targetPoint.lesson_number}_${targetPoint.point_number}`;
        const sourcePoint = sourceMap[key];

        if (sourcePoint) {
            console.log(`- Updating Lesson ${targetPoint.lesson_number} Point ${targetPoint.point_number}: ${targetPoint.title_zh}`);
            // Check if title matches (fuzzy match or name)
            if (sourcePoint.name !== targetPoint.title_zh) {
                console.warn(`  ! Title mismatch: Source("${sourcePoint.name}") vs Target("${targetPoint.title_zh}")`);
            }
            
            // Perform the update
            targetPoint.exercises = sourcePoint.exercises;
            updatedCount++;
            return targetPoint;
        } else {
            console.warn(`  ? No source found for Lesson ${targetPoint.lesson_number} Point ${targetPoint.point_number}`);
            return targetPoint;
        }
    });

    // Write back to target file
    fs.writeFileSync(targetPath, JSON.stringify(updatedTargetData, null, 2), 'utf8');

    console.log(`\n✅ Merge complete!`);
    console.log(`Updated ${updatedCount} grammar points.`);

} catch (error) {
    console.error(`❌ Error during merge:`, error.message);
    process.exit(1);
}
