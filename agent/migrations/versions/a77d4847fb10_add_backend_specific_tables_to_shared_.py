"""Add backend specific tables to shared database

Revision ID: a77d4847fb10
Revises: b6219a9db7ff
Create Date: 2025-08-26 14:24:55.083964

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a77d4847fb10'
down_revision: Union[str, Sequence[str], None] = 'b6219a9db7ff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add student_profiles table (backend-specific)
    op.create_table('student_profiles',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('learning_style', sa.String(length=20), nullable=True),
    sa.Column('preferred_difficulty', sa.String(length=10), nullable=True),
    sa.Column('learning_pace', sa.String(length=10), nullable=True),
    sa.Column('attention_span_minutes', sa.Integer(), nullable=True),
    sa.Column('prefers_visual_tools', sa.Boolean(), nullable=True),
    sa.Column('prefers_step_by_step', sa.Boolean(), nullable=True),
    sa.Column('prefers_immediate_feedback', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Add learning_sessions table (backend-specific)
    op.create_table('learning_sessions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('student_profile_id', sa.String(), nullable=False),
    sa.Column('topic_number', sa.String(length=10), nullable=False),
    sa.Column('session_type', sa.String(length=20), nullable=True),
    sa.Column('start_time', sa.DateTime(), nullable=True),
    sa.Column('end_time', sa.DateTime(), nullable=True),
    sa.Column('duration_minutes', sa.Integer(), nullable=True),
    sa.Column('questions_attempted', sa.Integer(), nullable=True),
    sa.Column('questions_correct', sa.Integer(), nullable=True),
    sa.Column('difficulty_level', sa.String(length=10), nullable=True),
    sa.Column('session_data', sa.JSON(), nullable=True),
    sa.Column('performance_metrics', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['student_profile_id'], ['student_profiles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('learning_sessions')
    op.drop_table('student_profiles')
