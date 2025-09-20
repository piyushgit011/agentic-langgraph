"""
Database migration to add student profile tables
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Create student_profiles table
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
        sa.Column('prefers_gamification', sa.Boolean(), nullable=True),
        sa.Column('overall_accuracy', sa.Float(), nullable=True),
        sa.Column('total_problems_solved', sa.Integer(), nullable=True),
        sa.Column('total_study_time_minutes', sa.Integer(), nullable=True),
        sa.Column('consecutive_correct_streak', sa.Integer(), nullable=True),
        sa.Column('current_level', sa.String(length=10), nullable=True),
        sa.Column('topic_performance', sa.JSON(), nullable=True),
        sa.Column('learning_patterns', sa.JSON(), nullable=True),
        sa.Column('struggle_areas', sa.JSON(), nullable=True),
        sa.Column('strength_areas', sa.JSON(), nullable=True),
        sa.Column('session_frequency', sa.Float(), nullable=True),
        sa.Column('average_session_duration', sa.Integer(), nullable=True),
        sa.Column('tool_usage_preferences', sa.JSON(), nullable=True),
        sa.Column('current_difficulty_level', sa.Float(), nullable=True),
        sa.Column('learning_velocity', sa.Float(), nullable=True),
        sa.Column('retention_rate', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('last_active_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_student_profiles_user_id'), 'student_profiles', ['user_id'], unique=True)
    
    # Create learning_sessions table
    op.create_table('learning_sessions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('student_profile_id', sa.String(), nullable=False),
        sa.Column('topic_number', sa.String(length=10), nullable=False),
        sa.Column('start_time', sa.DateTime(), nullable=True),
        sa.Column('end_time', sa.DateTime(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('problems_attempted', sa.Integer(), nullable=True),
        sa.Column('problems_correct', sa.Integer(), nullable=True),
        sa.Column('tools_used', sa.JSON(), nullable=True),
        sa.Column('mistakes_made', sa.JSON(), nullable=True),
        sa.Column('engagement_score', sa.Float(), nullable=True),
        sa.Column('help_requests', sa.Integer(), nullable=True),
        sa.Column('time_on_difficult_problems', sa.Integer(), nullable=True),
        sa.Column('mastery_achieved', sa.Boolean(), nullable=True),
        sa.Column('next_recommended_topic', sa.String(length=10), nullable=True),
        sa.ForeignKeyConstraint(['student_profile_id'], ['student_profiles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('learning_sessions')
    op.drop_index(op.f('ix_student_profiles_user_id'), table_name='student_profiles')
    op.drop_table('student_profiles')