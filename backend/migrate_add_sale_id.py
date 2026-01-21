"""
Migration script to add sale_id column to payments table
Run this script once to update the database schema
"""
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

# Get database path
db_path = os.getenv('DATABASE_URL', 'sqlite:///pos_salon.db')
# Remove sqlite:/// prefix if present
if db_path.startswith('sqlite:///'):
    db_path = db_path.replace('sqlite:///', '')
elif db_path.startswith('sqlite://'):
    db_path = db_path.replace('sqlite://', '')

# If relative path, make it relative to this script's directory
if not os.path.isabs(db_path):
    db_path = os.path.join(os.path.dirname(__file__), db_path)

print(f"Connecting to database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if sale_id column already exists
    cursor.execute("PRAGMA table_info(payments)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'sale_id' in columns:
        print("✓ Column 'sale_id' already exists in payments table")
    else:
        print("Adding 'sale_id' column to payments table...")
        # SQLite doesn't support adding a column with a foreign key directly
        # So we add the column first, then we'll need to recreate the foreign key
        # For now, just add the column - SQLAlchemy will handle the relationship
        cursor.execute("ALTER TABLE payments ADD COLUMN sale_id INTEGER")
        conn.commit()
        print("✓ Successfully added 'sale_id' column to payments table")
    
    # Verify the column was added
    cursor.execute("PRAGMA table_info(payments)")
    columns = [column[1] for column in cursor.fetchall()]
    print(f"\nCurrent payments table columns: {', '.join(columns)}")
    
    conn.close()
    print("\n✓ Migration completed successfully!")
    
except sqlite3.Error as e:
    print(f"✗ Database error: {e}")
    if conn:
        conn.close()
except Exception as e:
    print(f"✗ Error: {e}")
    if conn:
        conn.close()
