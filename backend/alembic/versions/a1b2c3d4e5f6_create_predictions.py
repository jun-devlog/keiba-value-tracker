"""create_predictions

Revision ID: a1b2c3d4e5f6
Revises: 87f5add2b87e
Create Date: 2026-07-09 17:23:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '87f5add2b87e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'predictions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('race_id', sa.Integer(), nullable=False),
        sa.Column('horse_id', sa.Integer(), nullable=False),
        sa.Column('rank', sa.Integer(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('memo', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['horse_id'], ['horses.id']),
        sa.ForeignKeyConstraint(['race_id'], ['races.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_predictions_id'), 'predictions', ['id'], unique=False)
    op.create_index(op.f('ix_predictions_race_id'), 'predictions', ['race_id'], unique=False)
    op.create_index(op.f('ix_predictions_horse_id'), 'predictions', ['horse_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_predictions_horse_id'), table_name='predictions')
    op.drop_index(op.f('ix_predictions_race_id'), table_name='predictions')
    op.drop_index(op.f('ix_predictions_id'), table_name='predictions')
    op.drop_table('predictions')
